import { Database } from "./supabase";

export type CreateRoomResponse =
	| {
			roomId: string;
			error?: never;
			success: boolean;
	  }
	| {
			roomId?: never;
			error: string;
			success: boolean;
	  };

export interface CreateRoomInput {
	name: string;
	is_ai?: boolean;
	chat_type?: "ai" | "person" | "group";
	other_user_id?: string;
}
export type Room = Database["public"]["Tables"]["rooms"]["Row"];
export type MinimalRoom = Pick<Room, "id" | "name" | "is_ai">;

export interface RecentRoom extends MinimalRoom {
	last_message?: string;
	last_message_at?: string;
}
