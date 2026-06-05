import { Database } from "./supabase";

export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type MiniMessage = Pick<
	Message,
	"id" | "content" | "created_at" | "is_ai" | "sender_id"
>;

export interface MinimalMessage extends MiniMessage {
	attachments?: AttachmentResponse[] | null;
}

export interface MessageInput {
	content: string;
	roomId: string;
	isAI?: boolean;
}

export interface Attachment {
	file: File;
	id: string;
	preview?: string;
	type: "image" | "document" | "audio" | "other";
}

export interface MessageResponse {
	data: Message | null;
	error: string | null;
	success: boolean;
}

export interface AttachmentResponse {
	name: string;
	url: string;
	type: string;
	size: number;
	uploadedBy: string;
	uploadedAt: Date;
}
