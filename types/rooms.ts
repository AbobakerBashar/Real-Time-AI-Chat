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
