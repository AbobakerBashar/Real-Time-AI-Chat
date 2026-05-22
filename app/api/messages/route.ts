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

export async function PUT(request: Request) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json(
				{ error: "Unauthorized", success: false },
				{ status: 401 },
			);
		}

		const { messageId, content } = await request.json();

		const supabase = await createClient();

		// First, verify that the user owns this message
		const { data: message, error: fetchError } = await supabase
			.from("messages")
			.select("sender_id")
			.eq("id", messageId)
			.single();

		if (fetchError || !message) {
			return NextResponse.json(
				{ error: "Message not found", success: false },
				{ status: 404 },
			);
		}

		if (message.sender_id !== user.id) {
			return NextResponse.json(
				{
					error: "Forbidden: You can only edit your own messages",
					success: false,
				},
				{ status: 403 },
			);
		}

		// Update the message
		const { data, error } = await supabase
			.from("messages")
			.update({ content })
			.eq("id", messageId)
			.select()
			.single();

		if (error) throw error;

		return NextResponse.json(
			{ data, success: true, error: null },
			{ status: 200 },
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

export async function DELETE(request: Request) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json(
				{ error: "Unauthorized", success: false },
				{ status: 401 },
			);
		}

		const { searchParams } = new URL(request.url);
		const messageId = searchParams.get("messageId");

		if (!messageId) {
			return NextResponse.json(
				{ error: "Message ID is required", success: false },
				{ status: 400 },
			);
		}

		const supabase = await createClient();

		// First, verify that the user owns this message
		const { data: message, error: fetchError } = await supabase
			.from("messages")
			.select("sender_id")
			.eq("id", messageId)
			.single();

		if (fetchError || !message) {
			return NextResponse.json(
				{ error: "Message not found", success: false },
				{ status: 404 },
			);
		}

		if (message.sender_id !== user.id) {
			return NextResponse.json(
				{
					error: "Forbidden: You can only delete your own messages",
					success: false,
				},
				{ status: 403 },
			);
		}

		// Delete the message
		const { error } = await supabase
			.from("messages")
			.delete()
			.eq("id", messageId);

		if (error) throw error;

		return NextResponse.json({ success: true, error: null }, { status: 200 });
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
