import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ roomId: string }> },
) {
	try {
		const { roomId } = await params;
		const { usersIds } = await request.json();

		if (!Array.isArray(usersIds) || usersIds.length === 0) {
			return NextResponse.json(
				{ error: "You must provide at least one user", success: false },
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

		// Check if current user is a admin or owner of the room
		const { data: rolrData, error: membershipError } = await supabase
			.from("room_members")
			.select("role")
			.eq("room_id", roomId)
			.eq("user_id", currentUser.id)
			.maybeSingle();

		if (membershipError) throw new Error(membershipError.message);
		if (!rolrData) {
			return NextResponse.json(
				{ error: "You are not a member of this room", success: false },
				{ status: 403 },
			);
		}

		if (rolrData.role === "owner" || rolrData?.role === "admin") {
			// Check if user is already a member of the room
			const { data: existingMember, error: existingError } = await supabase
				.from("room_members")
				.select("user_id")
				.eq("room_id", roomId)
				.in("user_id", usersIds);

			if (existingError) throw new Error(existingError.message);

			const existingIds = new Set(existingMember?.map((m) => m.user_id) ?? []);
			const usersToAdd = usersIds
				.filter((id: string) => !existingIds.has(id))
				?.map((id: string) => ({ room_id: roomId, user_id: id }));

			if (usersToAdd.length === 0) {
				return NextResponse.json(
					{
						error: "All selected users are already members",
						success: false,
						isMember: true,
					},
					{ status: 409 },
				);
			}

			// Add user to room members

			const { error: addError } = await supabase
				.from("room_members")
				.insert(usersToAdd);

			if (addError) throw new Error(addError.message);

			revalidatePath(`/chat/${roomId}`);
			revalidatePath(`/chat/${roomId}/manage`);
			return NextResponse.json(
				{
					success: true,
					message: `${usersToAdd.length} user(s) added to room`,
				},
				{ status: 200 },
			);
		} else {
			return NextResponse.json(
				{
					error: "You must be admin or owner to add users to this room",
					success: false,
				},
				{ status: 403 },
			);
		}
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
