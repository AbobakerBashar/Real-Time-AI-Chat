import { getCurrentUser } from "@/actions/userAction";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json(
				{ error: "Unauthorized", success: false },
				{ status: 401 },
			);
		}

		const { content, roomId, isAI = false } = await request.json();

		const supabase = await createClient();
		const { data, error } = await supabase
			.from("messages")
			.insert({
				content: content,
				room_id: roomId,
				sender_id: user.id,
				is_ai: isAI,
			})
			.select()
			.single();

		if (error) throw error;

		return NextResponse.json(
			{ data, success: true, error: null },
			{ status: 201 },
		);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ error: error.message, success: false, data: null },
				{ status: 500 },
			);
		} else {
			return NextResponse.json(
				{ error: "An unknown error occurred", success: false, data: null },
				{ status: 500 },
			);
		}
	}
}
