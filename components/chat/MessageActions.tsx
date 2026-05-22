"use client";
import { useState } from "react";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { useEditMessage, useDeleteMessage } from "@/hooks/useMesssages";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageActionsProps {
	messageId: string;
	roomId: string;
	initialContent: string;
}

const MessageActions = ({
	messageId,
	roomId,
	initialContent,
}: MessageActionsProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState(initialContent);
	const { mutate: editMessage, isPending: isEditingPending } = useEditMessage();
	const { mutate: deleteMessage, isPending: isDeletingPending } =
		useDeleteMessage();

	const handleSaveEdit = () => {
		if (!editedContent.trim()) return;

		editMessage(
			{ messageId, content: editedContent },
			{
				onSuccess: () => {
					setIsEditing(false);
				},
			},
		);
	};

	const handleCancelEdit = () => {
		setEditedContent(initialContent);
		setIsEditing(false);
	};

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this message?")) {
			deleteMessage({ messageId, roomId });
		}
	};

	if (isEditing) {
		return (
			<div className="w-full max-w-xs">
				<Textarea
					value={editedContent}
					onChange={(e) => setEditedContent(e.target.value)}
					placeholder="Edit your message..."
					className="min-h-16 resize-none text-sm"
					disabled={isEditingPending}
				/>
				<div className="flex gap-2 justify-end mt-2">
					<Button
						size="sm"
						variant="outline"
						onClick={handleCancelEdit}
						disabled={isEditingPending}
					>
						<X className="w-4 h-4" />
						Cancel
					</Button>
					<Button
						size="sm"
						onClick={handleSaveEdit}
						disabled={isEditingPending || !editedContent.trim()}
						className="bg-indigo-600 hover:bg-indigo-700"
					>
						<Check className="w-4 h-4" />
						Save
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex gap-2">
			<Button
				size="sm"
				variant="ghost"
				onClick={() => setIsEditing(true)}
				className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950"
				disabled={isDeletingPending}
			>
				<Edit2 className="w-4 h-4" />
				Edit
			</Button>
			<Button
				size="sm"
				variant="ghost"
				onClick={handleDelete}
				className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
				disabled={isDeletingPending}
			>
				<Trash2 className="w-4 h-4" />
				Delete
			</Button>
		</div>
	);
};

export default MessageActions;
