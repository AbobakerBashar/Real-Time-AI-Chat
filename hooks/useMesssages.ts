import { getMessages } from "@/actions/messagesActions";
import {
	MessageInput,
	MessageResponse,
	MinimalMessage,
} from "@/types/messages";
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
		mutationFn: async (data: MessageInput) => {
			const response = await fetch("/api/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result: MessageResponse = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to send message");
			}

			return result;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["messages", data.data?.room_id],
			});
		},
		onError: (error) => {
			toast.error(error.message || "Failed to send message");
		},
	});
};
