import { Database } from "./supabase";

export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type MinimalMessage = Pick<
	Message,
	"id" | "content" | "created_at" | "is_ai"
>;

export interface MessageInput {
	content: string;
	roomId: string;
	isAI?: boolean;
}

export interface MessageResponse {
	data: Message | null;
	error: string | null;
	success: boolean;
}
