import { getCurrentUser } from "@/actions/userAction";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

import { GoogleGenerativeAI } from "@google/generative-ai";

interface Attachment {
	name: string;
	url: string;
	type: string;
	size: number;
	uploadedBy: string;
	uploadedAt: Date;
}

interface MessagePayload {
	content: string;
	room_id: string;
	sender_id: string;
	is_ai: boolean;
	attachments?: Attachment[];
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export async function POST(request: Request) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json(
				{ error: "Unauthorized", success: false },
				{ status: 401 },
			);
		}

		const contentType = request.headers.get("content-type") || "";
		let content: string;
		let roomId: string;
		let isAI: boolean = false;
		let files: File[] = [];

		// 1. Parse request based on Content-Type
		if (contentType.includes("multipart/form-data")) {
			const formData = await request.formData();
			content = formData.get("content") as string;
			roomId = formData.get("roomId") as string;
			isAI = formData.get("isAI") === "true";
			files = formData.getAll("attachments") as File[];
		} else {
			const body = await request.json();
			content = body.content;
			roomId = body.roomId;
			isAI = body.isAI || false;
		}

		if (!content && files.length === 0) {
			return NextResponse.json(
				{ error: "Message content is required", success: false },
				{ status: 400 },
			);
		}

		if (!roomId) {
			return NextResponse.json(
				{ error: "Room ID is required", success: false },
				{ status: 400 },
			);
		}

		const supabase = await createClient();

		// 2. Handle File Uploads to Supabase Storage
		const attachmentUrls: Attachment[] = [];

		if (files.length > 0) {
			if (isAI) {
				return NextResponse.json(
					{
						error: "Attachments are not allowed in AI messages",
						success: false,
					},
					{ status: 400 },
				);
			}
			for (const file of files) {
				const fileExt = file.name.split(".").pop();

				const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
				const filePath = `${roomId}/${fileName}`;

				const { error: uploadError } = await supabase.storage
					.from("attachments")
					.upload(filePath, file, {
						contentType: file.type,
					});

				if (uploadError) {
					throw new Error(uploadError.message || "Failed to upload file");
				}

				const { data: publicUrlData } = supabase.storage
					.from("attachments")
					.getPublicUrl(filePath);

				attachmentUrls.push({
					name: file.name,
					url: publicUrlData.publicUrl,
					type: file.type,
					size: file.size,
					uploadedBy: user.id,
					uploadedAt: new Date(),
				});
			}
		}

		const messagePayload: MessagePayload = {
			content: content,
			room_id: roomId,
			sender_id: user.id,
			is_ai: isAI,
		};

		if (attachmentUrls.length > 0) {
			messagePayload.attachments = attachmentUrls;
		}

		/*==================================================
    1- AI MESSAGES
    ===================================================*/
		if (isAI) {
			const { data: membership, error: membershipError } = await supabase
				.from("room_members")
				.select("*")
				.eq("user_id", user.id)
				.eq("room_id", roomId)
				.single();

			if (membershipError || !membership) {
				return NextResponse.json(
					{ error: "Unauthorized. Please join the room first", success: false },
					{ status: 401 },
				);
			}

			// Save user message
			const { data: userMessage, error: userMessageError } = await supabase
				.from("messages")
				.insert({ ...messagePayload, is_ai: false })
				.select()
				.single();

			if (userMessageError) {
				throw new Error(
					userMessageError.message || "Failed to save user message",
				);
			}

			// Generate AI response
			const result = await model.generateContent(content);
			const aiMessageContent = result.response.text();

			const { data: aiMessage, error: aiMessageError } = await supabase
				.from("messages")
				.insert({
					content: aiMessageContent,
					room_id: roomId,
					is_ai: true,
				})
				.select()
				.single();

			if (aiMessageError) {
				throw new Error(aiMessageError.message || "Failed to save AI message");
			}

			return NextResponse.json(
				{ success: true, userMessage, aiMessage },
				{ status: 201 },
			);
		}

		/*==================================================
    2- NORMAL MESSAGES
    ===================================================*/
		const { data, error } = await supabase
			.from("messages")
			.insert(messagePayload)
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
