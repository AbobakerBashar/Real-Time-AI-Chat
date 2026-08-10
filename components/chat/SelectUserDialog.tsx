"use client";

import { Button } from "@/components/ui/button";

import { useUsersWithoutRoom } from "@/hooks/useAuth";
import { useCreateRoom, useRecentRooms } from "@/hooks/useRooms";
import { MinimalProfile } from "@/types/auth";
import { RecentRoom } from "@/types/rooms";
import { Loader2, Search } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Conversations from "./Conversations";
import { motion } from "framer-motion";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export interface SelectionDialogProps {
	isOpen: boolean;
	onClose: () => void;
	type: "person" | "group";
}

export default function SelectUserDialog({
	isOpen,
	onClose,
	type,
}: SelectionDialogProps) {
	const searchParams = useSearchParams();
	const [createNew, setCreateNew] = useState(
		searchParams.get("new") === "true",
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [groupName, setGroupName] = useState("");

	const router = useRouter();

	const { mutateAsync: createRoom, isPending: isCreatingRoom } =
		useCreateRoom();

	const { data: rooms, isLoading: isLoadingRooms } = useRecentRooms();

	const { data: users, isLoading: isLoadingUsers } = useUsersWithoutRoom();

	const loading = isLoadingUsers || isLoadingRooms;

	const filteredRooms: RecentRoom[] = rooms
		? rooms.filter((room) => {
				if (type === "group") {
					const matchtype = room.chat_type === "group";
					const matchSearch =
						!searchQuery ||
						room?.name?.toLowerCase?.()?.includes(searchQuery.toLowerCase());
					return matchtype && matchSearch;
				} else if (type === "person") {
					const matchtype = room.chat_type === "person";
					const matchSearch =
						!searchQuery ||
						room.username
							?.toLowerCase?.()
							?.includes?.(searchQuery.toLowerCase()) ||
						room.full_name
							?.toLowerCase?.()
							?.includes?.(searchQuery.toLowerCase());
					return matchtype && matchSearch;
				}
			})
		: [];

	const filteredUsers: MinimalProfile[] = users
		? users.filter((user) => {
				const matchesSearch =
					!searchQuery ||
					user?.username
						?.toLowerCase?.()
						?.includes?.(searchQuery.toLowerCase()) ||
					user?.full_name
						?.toLowerCase?.()
						?.includes?.(searchQuery.toLowerCase());
				return matchesSearch;
			}) || []
		: [];

	// Handle create new chat room
	const handleCreateRoom = async (userId?: string, username?: string) => {
		if (isCreatingRoom) return;
		if (type === "group") {
			const isValid =
				groupName?.trim() &&
				groupName.trim().length >= 3 &&
				groupName.trim().length <= 50;
			if (!isValid) {
				toast.error("Group name must be between 3 and 50 characters.");
				return;
			} else {
				const newRoom = await createRoom({
					name: groupName.trim(),
					chat_type: "group",
					is_ai: false,
				});
				router.push(`/chat/${newRoom.roomId}`);
			}
		} else if (type === "person") {
			if (!userId) {
				toast.error("Please select a user to chat with.");
				return;
			} else {
				const newRoomId = await createRoom({
					name: "Direct",
					chat_type: "person",
					is_ai: false,
					other_user_id: userId,
					username,
				});
				router.push(`/chat/${newRoomId.roomId}`);
			}
		}
	};

	const areAvailable =
		type === "group" ? filteredRooms.length > 0 : filteredUsers.length > 0;

	if (loading && isOpen) {
		return (
			<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity opacity-100">
				<div className="bg-linear-to-br from-gray-50 via-white to-gray-100 dark:bg-linear-to-br dark:from-gray-950 dark:via-gray-900 dark:to-black rounded-lg p-6 w-96 max-h-80 flex flex-col shadow-lg">
					<h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
						{type === "person" ? "Select a Person" : "Select a Group"}
					</h2>
					<div className="text-center py-4 text-gray-500">Loading...</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity p-4 ${
				isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
			onClick={onClose}
		>
			<div
				className="bg-linear-to-br from-gray-50 via-white to-gray-100 dark:bg-linear-to-br dark:from-gray-950 dark:via-gray-900 dark:to-black rounded-lg p-6 w-96 max-h-85 flex flex-col shadow-lg border border-gray-200 dark:border-gray-700"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
					{type === "person" ? "Select a Person" : "Select a Group"}
				</h2>

				<div className="grid grid-cols-2 gap-2 justify-between w-full mb-4">
					<Button
						onClick={() => setCreateNew(false)}
						variant="outline"
						size="sm"
						className={
							!createNew
								? "bg-linear-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 hover:from-indigo-500 hover:to-purple-500 hover:border-indigo-500"
								: ""
						}
					>
						Existing
					</Button>
					<Button
						onClick={() => setCreateNew(true)}
						variant="outline"
						size="sm"
						className={
							createNew
								? "bg-linear-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 hover:from-indigo-500 hover:to-purple-500 hover:border-indigo-500"
								: ""
						}
					>
						Create New
					</Button>
				</div>
				{createNew && type === "group" ? null : users && users.length < 0 ? (
					<p className="text-center py-4 text-gray-500">No users available.</p>
				) : areAvailable ? (
					<div className="relative group mb-4">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:group-focus-within:text-indigo-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
						<input
							type="text"
							placeholder="Search conversations..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-1.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 focus:border-indigo-500 dark:focus:border-indigo-500/50 focus:bg-white dark:focus:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
							style={{ colorScheme: "light dark" }}
						/>
					</div>
				) : (
					<p className="text-center py-4 text-gray-500">
						No conversations available.
					</p>
				)}

				<ScrollArea className="flex-1 mb-4 pr-2">
					<div className="space-y-2">
						{createNew ? (
							type === "group" ? (
								<form
									onSubmit={(e) => {
										e.preventDefault();
										handleCreateRoom();
									}}
									className="space-y-4"
								>
									<input
										type="text"
										value={groupName}
										placeholder="Group Name"
										onChange={(e) => setGroupName(e.target.value)}
										required
										autoFocus
										autoComplete="off"
										className="w-full px-4 py-1.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 focus:border-indigo-500 dark:focus:border-indigo-500/50 focus:bg-white dark:focus:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
										style={{ colorScheme: "light dark" }}
									/>
									<Button
										type="submit"
										disabled={isCreatingRoom}
										size="lg"
										className="bg-indigo-600 w-full text-white rounded-lg font-medium hover:bg-indigo-700"
									>
										{isCreatingRoom ? (
											<>
												<Loader2 className="h-3 w-3 animate-spin" />
												Creating...
											</>
										) : (
											"Create Group Chat"
										)}
									</Button>
								</form>
							) : (
								<UsersList
									users={filteredUsers}
									handleCreateRoom={handleCreateRoom}
								/>
							)
						) : (
							<Conversations rooms={filteredRooms} />
						)}
					</div>
				</ScrollArea>

				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={onClose}
						className="flex-1"
						disabled={isCreatingRoom}
					>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
}

function UsersList({
	users,
	handleCreateRoom,
}: {
	users: MinimalProfile[];
	handleCreateRoom: (userId: string, username: string) => void;
}) {
	return (
		<div className="divide-y divide-gray-200 dark:divide-gray-700">
			{users.length > 0 ? (
				users.map((user) => (
					<motion.div
						key={user.id}
						whileHover={{ scale: 1.02, x: 4 }}
						whileTap={{ scale: 0.98 }}
					>
						<button
							onClick={() =>
								handleCreateRoom(
									user.id,
									user.username || user.full_name || "Unknown",
								)
							}
							className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5
									}`}
						>
							<Avatar className="mt-1 shrink-0">
								{user.avatar_url && (
									<AvatarImage
										width={24}
										height={24}
										src={user.avatar_url}
										alt={user.username || "User Avatar"}
									/>
								)}
								<AvatarFallback className="bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
									{user.username
										? user.username.charAt(0).toUpperCase()
										: user.full_name
											? user.full_name.charAt(0).toUpperCase()
											: "U"}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 min-w-0">
								<div className="flex items-baseline gap-2 justify-between">
									<p className="font-medium text-sm truncate">
										{user.username || user.full_name || "Unknown User"}
									</p>
								</div>
							</div>
						</button>
					</motion.div>
				))
			) : (
				<div className="text-center py-4 text-gray-500">
					No users available.
				</div>
			)}
		</div>
	);
}
