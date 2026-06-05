import { MinimalProfile } from "@/types/auth";
import { motion } from "framer-motion";
import { MessageCircle, Send, Sparkles } from "lucide-react";
import { SenderBadge } from "./SenderBadge";
import { AttachmentsSection } from "./AttachmentsSection";
import { MessageFooter } from "./MessageFooter";
import { AttachmentResponse } from "@/types/messages";

interface Message {
	id: string;
	content: string;
	sender_id: string | null;
	is_ai: boolean | null;
	created_at: string | null;
	attachments?: AttachmentResponse[] | null;
}

interface MessageItemProps {
	message: Message;
	isSent: boolean;
	isAIMessage: boolean;
	members: MinimalProfile[];
	currentUserId?: string;
}

const messageVariants = {
	hidden: { opacity: 0, y: 20, scale: 0.8 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.3 },
	},
	exit: { opacity: 0, y: -10 },
};

const getMessageBubbleClasses = (
	isSent: boolean,
	isAIMessage: boolean,
	hasAttachments: boolean,
) => {
	const baseClasses =
		"rounded-lg shadow-sm transition-all min-w-70 rounded-lg shadow-sm transition-all";

	if (hasAttachments) {
		if (isSent)
			return `${baseClasses} max-w-lg md:max-w-2xl px-4 py-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-br-none text-gray-900 dark:text-white`;
		if (isAIMessage)
			return `${baseClasses} max-w-lg md:max-w-2xl px-4 py-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-bl-none text-gray-900 dark:text-gray-100`;
		return `${baseClasses} max-w-lg md:max-w-2xl px-4 py-3 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-bl-none text-gray-900 dark:text-gray-100`;
	}

	if (isSent)
		return `${baseClasses} max-w-sm sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-600 dark:to-purple-600 text-white rounded-br-none shadow-indigo-500/20`;
	if (isAIMessage)
		return `${baseClasses} max-w-sm sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-gray-900 dark:text-white rounded-bl-none border border-purple-200 dark:border-purple-700`;
	return `${baseClasses} max-w-sm sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 bg-linear-to-r from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 text-gray-900 dark:text-white rounded-bl-none border border-cyan-200 dark:border-cyan-700`;
};

const SenderIcon = ({
	isSent,
	isAIMessage,
}: {
	isSent: boolean;
	isAIMessage: boolean;
}) => {
	if (isSent) {
		return (
			<motion.div
				whileHover={{ scale: 1.1 }}
				className="shrink-0 flex items-center justify-center"
			>
				<div className="w-8 h-8 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white">
					<Send className="w-4 h-4" />
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			whileHover={{ scale: 1.1 }}
			className="shrink-0 flex items-center justify-center"
		>
			{isAIMessage ? (
				<div className="w-8 h-8 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
					<Sparkles className="w-4 h-4" />
				</div>
			) : (
				<div className="w-8 h-8 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
					<MessageCircle className="w-4 h-4" />
				</div>
			)}
		</motion.div>
	);
};

export const MessageItem = ({
	message,
	isSent,
	isAIMessage,
	members,
}: MessageItemProps) => {
	const hasAttachments = message.attachments && message.attachments.length > 0;

	return (
		<motion.div
			variants={messageVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			className={`flex ${isSent ? "justify-end" : "justify-start"} gap-2 items-end`}
		>
			{!isSent && <SenderIcon isSent={isSent} isAIMessage={isAIMessage} />}

			<motion.div
				whileHover={{ scale: 1.02 }}
				className={getMessageBubbleClasses(
					isSent,
					isAIMessage,
					!!hasAttachments,
				)}
			>
				<div className="flex items-center gap-2 mb-2">
					<SenderBadge
						isSent={isSent}
						isAIMessage={isAIMessage}
						hasAttachments={!!hasAttachments}
						members={members}
						senderId={message.sender_id}
					/>
				</div>

				<p className="text-sm md:text-base wrap-break-word">
					{message.content}
				</p>

				<AttachmentsSection
					attachments={message.attachments || []}
					messageId={message.id}
					hasContent={!!message.content}
				/>

				<MessageFooter
					timestamp={message.created_at || ""}
					isSent={isSent}
					hasAttachments={!!hasAttachments}
					isAIMessage={isAIMessage}
				/>
			</motion.div>

			{isSent && <SenderIcon isSent={isSent} isAIMessage={isAIMessage} />}
		</motion.div>
	);
};
