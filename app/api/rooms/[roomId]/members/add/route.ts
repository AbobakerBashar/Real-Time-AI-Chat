import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ roomId: string }> },
) {
	try {
		const { roomId } = await params;
		const { userId } = await request.json();

		if (!userId) {
			return NextResponse.json(
				{ error: "User ID is required", success: false },
				{ status: 400 },
			);
		}

		const supabase = await createClient();
		const {
			data: { user: currentUser },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError) throw authError;
		if (!currentUser) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if current user is a member of the room
		const { data: currentMembership, error: membershipError } = await supabase
			.from("rooms")
			.select("id")
			.eq("id", roomId)
			.eq("created_by", currentUser.id)
			.maybeSingle();

		if (membershipError) throw membershipError;
		if (!currentMembership) {
			return NextResponse.json(
				{ error: "You are not a owner of this room", success: false },
				{ status: 403 },
			);
		}

		// Check if user is already a member of the room
		const { data: existingMember, error: existingError } = await supabase
			.from("room_members")
			.select("id")
			.eq("room_id", roomId)
			.eq("user_id", userId)
			.maybeSingle();

		if (existingError) throw existingError;
		if (existingMember) {
			return NextResponse.json(
				{
					error: "User is already a member of this room",
					success: false,
					isMember: true,
				},
				{ status: 409 },
			);
		}

		// Add user to room members
		const { error: addError } = await supabase.from("room_members").insert({
			room_id: roomId,
			user_id: userId,
		});

		if (addError) throw addError;

		return NextResponse.json(
			{ success: true, message: "User added to room" },
			{ status: 200 },
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
