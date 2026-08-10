import { Member } from "./auth";
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
	username?: string;
}
export type Room = Database["public"]["Tables"]["rooms"]["Row"];
export type MinimalRoom = Pick<Room, "id" | "name" | "chat_type">;

export interface RecentRoom extends MinimalRoom {
	last_message?: string | null;
	last_message_at?: string | null;
	sent_by_current_user?: boolean;
	username?: string | null;
	full_name?: string | null;
	avatar_url?: string | null;
	is_active?: boolean;
	unread_count?: number;
	last_read_at?: string | null;
	last_read_message_id?: string | null;
}

export interface RoomDetails {
	id: string;
	name: string;
	avatar_url?: string;
	description?: string;
	type: "ai" | "person" | "group";
	members?: Member[];
	current_user?: {
		id: string;
		role: "admin" | "member" | "owner";
	};
}

export interface UnreadCounts {
	room_id: string;
	count: number;
}
