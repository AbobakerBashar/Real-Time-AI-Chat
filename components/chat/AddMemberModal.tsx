"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Search, UserPlus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAddUserToGroup, useGetNonGroupUsers } from "@/hooks/useRooms";

interface AddMemberModalProps {
	isOpen: boolean;
	setIsAddMemberModalOpen: (isOpen: boolean) => void;
	roomId: string;
}

const AddMemberModal = ({
	isOpen,
	setIsAddMemberModalOpen,
	roomId,
}: AddMemberModalProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

	const { mutateAsync: addUserToGroup, isPending: isAdding } =
		useAddUserToGroup();

	const { data: availableUsers, isLoading: isLoadingUsers } =
		useGetNonGroupUsers(roomId);

	const toggleUserSelection = (userId: string) => {
		setSelectedUsers((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId],
		);
	};

	const handleAddMembers = async () => {
		if (!roomId) return;
		if (isAdding || isLoadingUsers) return;
		if (selectedUsers.length === 0) {
			toast.error("Please select at least one user to add.");
			return;
		}
		await addUserToGroup({ roomId, usersIds: selectedUsers });
		onClose();
	};

	const onClose = () => {
		setSearchQuery("");
		setSelectedUsers([]);
		setIsAddMemberModalOpen(false);
	};

	return (
		<Dialog open={isOpen || isAdding} onOpenChange={onClose}>
			<DialogContent className="max-w-md h-calc(100%-12rem)">
				<DialogHeader>
					<DialogTitle>Add Members to Group</DialogTitle>
					<DialogDescription>
						Select users to add to this group. You can add multiple members at
						once.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Search Bar */}
					<div className="relative">
						<Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
						<Input
							placeholder="Search by name or email..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>

					{/* Users List */}
					<ScrollArea className="h-60 overflow-y-auto pr-4">
						{availableUsers && availableUsers.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-full text-center">
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{searchQuery
										? "No users found matching your search"
										: "No available users to add"}
								</p>
							</div>
						) : (
							<div className="space-y-2">
								{isLoadingUsers ? (
									<div className="flex items-center justify-center h-20">
										<Loader2 className="w-6 h-6 animate-spin text-gray-500" />
									</div>
								) : (
									availableUsers?.map((user) => (
										<motion.button
											key={user.id}
											onClick={() => toggleUserSelection(user.id)}
											disabled={isAdding}
											className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
												selectedUsers.includes(user.id)
													? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
													: "border-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
											}`}
										>
											<Avatar className="h-8 w-8 shrink-0">
												{user.avatar_url && (
													<AvatarImage src={user.avatar_url} />
												)}
												<AvatarFallback>
													{user?.full_name?.charAt(0)?.toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 text-left min-w-0">
												<p className="text-sm font-medium text-gray-900 dark:text-white truncate">
													{user?.full_name}
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
													@{user?.username}
												</p>
											</div>
										</motion.button>
									))
								)}
							</div>
						)}
					</ScrollArea>

					{/* Selected Count */}
					{selectedUsers.length > 0 && (
						<div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
							{selectedUsers.length} user
							{selectedUsers.length !== 1 ? "s" : ""} selected
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex gap-2 justify-end mb-4">
						<Button variant="outline" onClick={onClose} disabled={isAdding}>
							Cancel
						</Button>
						<Button
							onClick={handleAddMembers}
							disabled={
								selectedUsers.length === 0 || isAdding || isLoadingUsers
							}
							className="gap-2"
						>
							{isAdding ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									Adding...
								</>
							) : (
								<>
									<UserPlus className="w-4 h-4" />
									Add {selectedUsers.length > 0
										? selectedUsers.length
										: ""}{" "}
									Member{selectedUsers.length !== 1 ? "s" : ""}
								</>
							)}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddMemberModal;
