import { getMessages } from "@/actions/messagesActions";
import {
	Attachment,
	Message,
	MessageInput,
	MessageResponse,
	MinimalMessage,
} from "@/types/messages";
import { RecentRoom } from "@/types/rooms";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetMessages = (roomId: string) => {
	return useQuery<MinimalMessage[]>({
		queryKey: ["messages", roomId],
		queryFn: async () => await getMessages(roomId),
		enabled: !!roomId,
	});
};

export const useSendMessage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["sendMessage"],

		mutationFn: async ({
			data,
			attachments,
		}: {
			data: MessageInput;
			attachments?: Attachment[];
		}) => {
			const hasAttachments = attachments && attachments.length > 0;
			let body: BodyInit;
			let headers: HeadersInit = {};

			if (hasAttachments) {
				const formData = new FormData();
				formData.append("content", data.content);
				formData.append("roomId", data.roomId);
				formData.append("isAI", String(data.isAI || false));

				attachments.forEach((attachment) => {
					formData.append("attachments", attachment.file);
				});

				body = formData;
			} else {
				body = JSON.stringify(data);
				headers = { "Content-Type": "application/json" };
			}

			const response = await fetch("/api/messages", {
				method: "POST",
				headers,
				body,
			});

			const result: MessageResponse = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to send message");
			}

			return result;
		},

		onSuccess: (data) => {
			if (!data.data?.id) return;

			const message = data.data;
			const roomId = message.room_id;

			queryClient.setQueryData<Message[]>(["messages", roomId], (old = []) => {
				if (old.some((m) => m.id === message.id)) return old;

				return [...old, message];
			});

			queryClient.setQueryData<RecentRoom[]>(["recent-rooms"], (old = []) => {
				return old.map((room) =>
					room.id === roomId
						? {
								...room,
								last_message: data?.data?.content,
								last_message_at: data?.data?.created_at,
								sent_by_current_user: true,
							}
						: room,
				);
			});
		},

		onError: (error: Error) => {
			toast.error(error.message || "Failed to send message");
		},
	});
};

/*================= Edit Message =================*/
export const useEditMessage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["editMessage"],
		mutationFn: async ({
			messageId,
			content,
		}: {
			messageId: string;
			content: string;
		}) => {
			const response = await fetch("/api/messages", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messageId, content }),
			});

			const result: MessageResponse = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to edit message");
			}

			return result;
		},

		onSuccess: (data) => {
			if (!data.data?.id || !data.data?.room_id) return;

			const message = data.data;
			const roomId = message.room_id;

			queryClient.setQueryData<MinimalMessage[]>(
				["messages", roomId],
				(old = []) => {
					return old.map((m) => (m.id === message.id ? message : m));
				},
			);
		},

		onError: (error: Error) => {
			toast.error(error.message || "Failed to edit message");
		},
	});
};

/*================= Delete Message =================*/
export const useDeleteMessage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["deleteMessage"],
		mutationFn: async ({
			messageId,
			roomId,
		}: {
			messageId: string;
			roomId: string;
		}) => {
			const response = await fetch(`/api/messages?messageId=${messageId}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to delete message");
			}

			return result;
		},

		onSuccess: (_, { messageId, roomId }) => {
			queryClient.setQueryData<MinimalMessage[]>(
				["messages", roomId],
				(old = []) => {
					return old.filter((m) => m.id !== messageId);
				},
			);

			toast.success("Message deleted");
		},

		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete message");
		},
	});
};

/*================= Get Recent Messages =================*/
// export const useRecentMessages = (limit: number = 10) => {
// 	return useQuery({
// 		queryKey: ["recent-rooms"],
// 		queryFn: async () => await getRecentRooms(limit),
// 	});
// };
