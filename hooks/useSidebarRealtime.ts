import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types/messages";
import { RecentRoom } from "@/types/rooms";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useSidebarRealtime = () => {
	const queryClient = useQueryClient();

	useEffect(() => {
		const supabase = createClient();

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

						const roomIndex = old.findIndex((r) => r.id === newMessage.room_id);

						if (roomIndex === -1) {
							queryClient.invalidateQueries({ queryKey: ["recent-rooms"] });
							return old;
						}

						// unread_count depends on room_members.last_read_* and messages.created_at,
						// so the safest approach is to refetch the sidebar list.
						queryClient.invalidateQueries({ queryKey: ["recent-rooms"] });
						return old;
					});
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [queryClient]);
};
