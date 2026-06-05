"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "lucide-react";
import { Member } from "@/types/auth";
import { useState } from "react";

interface TransferOwnershipModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	members: Member[];
	currentUserId: string;
	onTransfer: (newOwnerId: string) => Promise<void>;
	isTransferring?: boolean;
}

export const TransferOwnershipModal = ({
	open,
	onOpenChange,
	members,
	currentUserId,
	onTransfer,
	isTransferring = false,
}: TransferOwnershipModalProps) => {
	const [selectedUserId, setSelectedUserId] = useState<string>("");

	const handleConfirm = async () => {
		if (!selectedUserId) return;
		await onTransfer(selectedUserId);
		setSelectedUserId("");
		onOpenChange(false);
	};

	return (
		<Dialog open={open || isTransferring} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Transfer Group Ownership</DialogTitle>
					<DialogDescription>
						You are the owner of this group. Before leaving, you must transfer
						ownership to another member.
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="max-h-[60vh] pr-4">
					<div className="space-y-2">
						{members.map(
							(member) =>
								member.id !== currentUserId && (
									<button
										key={member.id}
										onClick={() => setSelectedUserId(member.id)}
										className={`w-full p-3 rounded-lg text-left border-2 transition-colors ${
											selectedUserId === member.id
												? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
												: "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
										}`}
										disabled={isTransferring}
									>
										<div className="flex items-center gap-3">
											<Avatar className="h-10 w-10">
												{member.avatar_url && (
													<AvatarImage src={member.avatar_url} />
												)}
												<AvatarFallback>
													{(member.full_name || member.username)
														?.substring(0, 2)
														.toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<p className="font-medium">
													{member.full_name || member.username}
												</p>
												<p className="text-sm text-gray-500">
													@{member.username}
												</p>
											</div>
										</div>
									</button>
								),
						)}
					</div>
				</ScrollArea>

				<div className="flex gap-2 pt-4">
					<Button
						variant="outline"
						onClick={() => {
							setSelectedUserId("");
							onOpenChange(false);
						}}
						disabled={isTransferring}
						className="flex-1"
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirm}
						disabled={!selectedUserId || isTransferring}
						className="flex-1"
					>
						{isTransferring ? (
							<>
								<Loader className="w-4 h-4 animate-spin" />
								<span>Transferring...</span>
							</>
						) : (
							"Transfer & Leave"
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
