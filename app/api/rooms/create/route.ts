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

		const supabase = await createClient();
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error) throw error;
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if it's a person chat and other_user_id is provided, then check if a room already exists between these two users
		if ((chat_type === "person" || chat_type === "group") && other_user_id) {
			const { data: myRooms, error: myRoomsError } = await supabase
				.from("room_members")
				.select("room_id")
				.eq("user_id", user.id);

			if (myRoomsError) throw myRoomsError;

			if (myRooms && myRooms.length > 0) {
				const { data: existingRoom, error } = await supabase
					.from("room_members")
					.select("room_id")
					.in(
						"room_id",
						myRooms.map((r) => r.room_id),
					)
					.eq("user_id", other_user_id)
					.maybeSingle();

				if (error) throw error;

				if (existingRoom) {
					return NextResponse.json(
						{ roomId: existingRoom.room_id, success: true },
						{ status: 200 },
					);
				}
			}
		}

		// Create room
		const { data: room, error: roomError } = await supabase
			.from("rooms")
			.insert({
				name,
				is_ai,
				created_by: user.id,
			})
			.select("*")
			.single();

		if (roomError) throw roomError;

		// Add current user to room members
		const { error: memberError1 } = await supabase.from("room_members").insert({
			room_id: room.id,
			user_id: user.id,
		});

		if (memberError1) throw memberError1;

		// If it's a person or group chat with other_user_id, add them too
		if (other_user_id && (chat_type === "person" || chat_type === "group")) {
			const { error: memberError2 } = await supabase
				.from("room_members")
				.insert({
					room_id: room.id,
					user_id: other_user_id,
				});

			if (memberError2) throw memberError2;
		}

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
		} else {
			return NextResponse.json(
				{ error: "An unknown error occurred", success: false },
				{ status: 500 },
			);
		}
	}
}
