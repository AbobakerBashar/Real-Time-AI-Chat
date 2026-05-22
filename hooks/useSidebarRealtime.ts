import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types/messages";
import { RecentRoom } from "@/types/rooms";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useSidebarRealtime = () => {
	const queryClient = useQueryClient();

	useEffect(() => {
		const supabase = createClient();
		const currentUser = queryClient.getQueryData<{ id: string }>(["user"]);

		// Listen to ALL inserts in the messages table
		const channel = supabase
			.channel("sidebar-global-updates")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
				},
				(payload) => {
					const newMessage = payload.new as Message;

					queryClient.setQueryData<RecentRoom[]>(["recent-rooms"], (old) => {
						if (!old) return [];

						// 1. Check if the room for this message exists in our sidebar list
						const roomIndex = old.findIndex((r) => r.id === newMessage.room_id);

						if (roomIndex === -1) {
							// If the room isn't in our sidebar list, just refetch the whole list from the server
							queryClient.invalidateQueries({ queryKey: ["recent-rooms"] });
							return old;
						}

						// 2. Create the updated room object
						const updatedRoom: RecentRoom = {
							...old[roomIndex],
							last_message: newMessage.content,
							last_message_at: newMessage.created_at,
							sent_by_current_user: newMessage.sender_id === currentUser?.id,
						};

						// 3. Remove the room from its current position and move it to the TOP [index 0]
						const remainingRooms = old.filter(
							(r) => r.id !== newMessage.room_id,
						);

						return [updatedRoom, ...remainingRooms];
					});
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [queryClient]);
};
