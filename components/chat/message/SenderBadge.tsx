import { Badge } from "@/components/ui/badge";
import { MinimalProfile } from "@/types/auth";
import { MessageCircle, Send, Sparkles } from "lucide-react";

interface SenderBadgeProps {
	isSent: boolean;
	isAIMessage: boolean;
	hasAttachments: boolean;
	senderUsername?: string;
	members?: MinimalProfile[];
	senderId?: string | null;
}

export const SenderBadge = ({
	isSent,
	isAIMessage,
	hasAttachments,
	senderUsername,
	members,
	senderId,
}: SenderBadgeProps) => {
	const getBadgeClass = () => {
		const baseClass = "text-xs";
		if (hasAttachments) {
			if (isSent)
				return `${baseClass} bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200`;
			if (isAIMessage)
				return `${baseClass} bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-200`;
			return `${baseClass} bg-cyan-200 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200`;
		}
		if (isSent)
			return `${baseClass} bg-indigo-200/50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200`;
		if (isAIMessage)
			return `${baseClass} bg-purple-200/50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-200`;
		return `${baseClass} bg-cyan-200/50 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-200`;
	};

	if (isSent) {
		return (
			<Badge variant="secondary" className={getBadgeClass()}>
				<Send className="w-3 h-3 mr-1" />
				You
			</Badge>
		);
	}

	if (isAIMessage) {
		return (
			<Badge variant="secondary" className={getBadgeClass()}>
				<Sparkles className="w-3 h-3 mr-1" />
				AI Assistant
			</Badge>
		);
	}

	const username =
		senderUsername ||
		(members && members.find((m) => m.id === senderId)?.username) ||
		"User";

	return (
		<Badge variant="secondary" className={getBadgeClass()}>
			<MessageCircle className="w-3 h-3 mr-1" />
			{username}
		</Badge>
	);
};
