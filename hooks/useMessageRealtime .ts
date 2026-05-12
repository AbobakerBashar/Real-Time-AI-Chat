import { createClient } from "@/lib/supabase/client";
import { MinimalMessage } from "@/types/messages";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useMessageRealtime = (roomId: string) => {
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!roomId) return;
		const supabase = createClient();
		const channel = supabase
			.channel(`room-${roomId}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "messages",
					filter: `room_id=eq.${roomId}`,
				},
				(payload) => {
					const newMessage = payload.new as MinimalMessage;

					// IMPORTANT: append new message to messages cache
					queryClient.setQueryData<MinimalMessage[]>(
						["messages", roomId],
						(old = []) => {
							// avoid duplicates
							if (old.some((m) => m.id === newMessage.id)) return old;
							return [...old, newMessage];
						},
					);
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [roomId, queryClient]);
};
