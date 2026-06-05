import { Button } from "@/components/ui/button";
import { formatTime } from "@/utils/formatTime";
import { Pen, Trash2 } from "lucide-react";

interface MessageFooterProps {
	timestamp: string;
	isSent: boolean;
	hasAttachments: boolean;
	isAIMessage: boolean;
}

export const MessageFooter = ({
	timestamp,
	isSent,
	hasAttachments,
	isAIMessage,
}: MessageFooterProps) => {
	const getTimestampColor = () => {
		if (hasAttachments) {
			if (isSent) return "text-indigo-600 dark:text-indigo-400";
			if (isAIMessage) return "text-purple-600 dark:text-purple-400";
			return "text-cyan-600 dark:text-cyan-400";
		}
		if (isSent) return "text-indigo-100";
		if (isAIMessage) return "text-purple-700 dark:text-purple-300";
		return "text-cyan-700 dark:text-cyan-300";
	};

	return (
		<div className="mt-2 flex items-center gap-5 justify-between">
			<p className={`text-xs opacity-70 ${getTimestampColor()}`}>
				{formatTime(timestamp || "")}
			</p>
			{isSent && (
				<div className="flex items-center gap-0">
					<Button
						size="sm"
						className="w-6 h-6 p-0 text-indigo-600 hover:text-indigo-700 bg-transparent"
					>
						<Pen className="w-3 h-3" />
					</Button>
					<Button
						size="sm"
						className="w-6 h-6 p-0 bg-transparent text-destructive hover:text-red-600"
					>
						<Trash2 className="w-full h-full" />
					</Button>
				</div>
			)}
		</div>
	);
};
