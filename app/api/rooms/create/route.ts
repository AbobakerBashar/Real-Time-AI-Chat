import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const {
			name,
			is_ai = false,
			chat_type = "person",
			other_user_id,
		} = await request.json();

		// Validate chat type
		if (!["person", "group", "ai"].includes(chat_type)) {
			return NextResponse.json(
				{ error: "Invalid chat type", success: false },
				{ status: 400 },
			);
		}

		const supabase = await createClient();

		// Auth
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError) throw authError;
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		/* -----------------------------------------------(1) PERSON CHAT — check if room already exists ------------------------------------------------ */
		if (chat_type === "person") {
			if (!other_user_id) {
				return NextResponse.json(
					{ error: "Other user ID is required for person chat" },
					{ status: 400 },
				);
			}

			// Get my rooms
			const { data: myRooms, error: myRoomsError } = await supabase
				.from("room_members")
				.select("room_id")
				.eq("user_id", user.id);

			if (myRoomsError) throw new Error(myRoomsError.message);

			if (myRooms.length > 0) {
				const { data: existingRoom, error: existingError } = await supabase
					.from("room_members")
					.select("room_id")
					.in(
						"room_id",
						myRooms.map((r) => r.room_id),
					)
					.eq("user_id", other_user_id)
					.maybeSingle();

				if (existingError) throw new Error(existingError.message);

				// A room already exists between these two users
				if (existingRoom) {
					return NextResponse.json(
						{ roomId: existingRoom.room_id, success: true },
						{ status: 200 },
					);
				}
			}
		}

		/* ----------------------------------------------- (2) GROUP CHAT — validate group name ------------------------------------------------ */
		if (chat_type === "group") {
			if (name.trim().length === 0) {
				return NextResponse.json(
					{ error: "Group name is required", success: false },
					{ status: 400 },
				);
			}
		}

		/* ----------------------------------------------- (3) CREATE ROOM ------------------------------------------------ */
		const { data: room, error: roomError } = await supabase
			.from("rooms")
			.insert({
				name,
				is_ai,
				created_by: user.id,
				chat_type,
			})
			.select("id")
			.single();

		if (roomError) throw new Error(roomError.message);

		/* ----------------------------------------------- (4) ADD MEMBERS ------------------------------------------------ */

		// Person chat → add two users
		if (chat_type === "person") {
			const { error: memberError } = await supabase
				.from("room_members")
				.insert([
					{ room_id: room.id, user_id: user.id },
					{ room_id: room.id, user_id: other_user_id },
				]);

			if (memberError) throw new Error(memberError.message);
		}

		// Group chat → add only creator (other members added later) BUT if other_user_id is provided, add them
		if (chat_type === "group") {
			const { error: memberError } = await supabase
				.from("room_members")
				.insert({ room_id: room.id, user_id: user.id, role: "owner" });

			if (memberError) throw new Error(memberError.message);

			if (other_user_id) {
				await supabase.from("room_members").insert({
					room_id: room.id,
					user_id: other_user_id,
				});
			}
		}

		// AI chat → add only creator
		if (chat_type === "ai") {
			const { error: memberError } = await supabase
				.from("room_members")
				.insert({ room_id: room.id, user_id: user.id });

			if (memberError) throw new Error(memberError.message);
		}

		/* ----------------------------------------------- SUCCESS RESPONSE ------------------------------------------------ */
		return NextResponse.json(
			{ roomId: room.id, success: true },
			{ status: 201 },
		);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error.message, success: false },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{ error: "Unknown server error", success: false },
			{ status: 500 },
		);
	}
}
