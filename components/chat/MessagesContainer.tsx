"use client";
import { useCurrentUser } from "@/hooks/useAuth";
import { useMessageRealtime } from "@/hooks/useMessageRealtime ";
import { useGetMessages } from "@/hooks/useMesssages";
import { RoomDetails } from "@/types/rooms";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { MessageItem } from "./message/MessageItem";
import { markRoomAsRead } from "@/actions/room";
import { useQueryClient } from "@tanstack/react-query";

const MessagesContainer = ({ details }: { details: RoomDetails | null }) => {
	const queryClient = useQueryClient();

	const roomId = details?.id || "";
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { data: messages, isLoading } = useGetMessages(roomId);
	const { data: currentUser } = useCurrentUser();
	const members = details?.members || [];

	useMessageRealtime(roomId);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const lastMarkedRef = useRef<string | null>(null);

	// Mark messages as read when the user views them
	useEffect(() => {
		if (!messages?.length || !currentUser) return;

		const lastMessage = messages[messages.length - 1];

		if (lastMessage.sender_id === currentUser.id) return;

		if (lastMarkedRef.current === lastMessage.id) return;

		if (document.visibilityState === "visible") {
			lastMarkedRef.current = lastMessage.id;

			markRoomAsRead(roomId, lastMessage.id)
				.then(() =>
					queryClient.setQueryData(
						["unread-counts", roomId],
						(old: Record<string, number> = {}) => ({
							...old,
							[roomId]: 0,
						}),
					),
				)
				.catch((error) => {
					console.error("Failed to mark room as read:", error);
				});
		}
	}, [roomId, messages, currentUser, queryClient]);

	const isSentMessage = (senderId: string | null) => {
		return senderId === currentUser?.id;
	};

	return (
		<div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4 flex flex-col">
			<div className="max-w-4xl w-full mx-auto flex-1 flex flex-col space-y-3 sm:space-y-4">
				<AnimatePresence>
					{!isLoading &&
						messages &&
						messages.map((message) => (
							<MessageItem
								key={message.id}
								message={message}
								isSent={isSentMessage(message.sender_id)}
								isAIMessage={message.is_ai || false}
								members={members}
								currentUserId={currentUser?.id}
							/>
						))}
				</AnimatePresence>

				{isLoading && <LoadingState />}

				<div ref={messagesEndRef} />
			</div>
		</div>
	);
};

const LoadingState = () => (
	<motion.div
		initial={{ opacity: 0, y: 10 }}
		animate={{ opacity: 1, y: 0 }}
		className="flex justify-start gap-2 items-end"
	>
		<div className="w-8 h-8 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
			<Sparkles className="w-4 h-4" />
		</div>
		<div className="bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2 border border-purple-200 dark:border-purple-700">
			<motion.div
				animate={{ rotate: 360 }}
				transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
			>
				<Loader className="w-4 h-4 text-purple-600 dark:text-purple-400" />
			</motion.div>
			<span className="text-sm text-purple-700 dark:text-purple-300">
				Loading messages...
			</span>
		</div>
	</motion.div>
);

export default MessagesContainer;
