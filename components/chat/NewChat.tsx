import { useCreateRoom, useGetAIRoom } from "@/hooks/useRooms";
import { MinimalProfile } from "@/types/auth";
import { motion } from "framer-motion";
import { Bot, Loader2, User, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const NewChat = ({ users }: { users: MinimalProfile[] | undefined }) => {
	const { data: aiRoom, isLoading: isLoadingAIRoom } = useGetAIRoom();

	const [groupName, setGroupName] = useState("");
	const [activeButton, setActiveButton] = useState<"person" | "group">(
		"person",
	);

	const searchParams = useSearchParams();
	const router = useRouter();
	const searchQuery = searchParams.get("search") || "";

	const { mutateAsync: createRoom, isPending: isCreatingRoom } =
		useCreateRoom();

	// Handle create new chat room
	const handleCreateRoom = async (userId?: string, username?: string) => {
		if (isCreatingRoom) return;
		if (activeButton === "group") {
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
		} else if (activeButton === "person") {
			if (!userId) {
				toast.error("Please select a user to chat with.");
				return;
			} else {
				const name = username || "Direct";
				const newRoomId = await createRoom({
					name,
					chat_type: "person",
					is_ai: false,
					other_user_id: userId,
				});
				router.push(`/chat/${newRoomId.roomId}`);
			}
		}
	};

	// Handle create AI chat room
	const handleCreateAIChat = async () => {
		if (isLoadingAIRoom || isCreatingRoom) return;
		if (aiRoom) {
			router.push(`/chat/${aiRoom.id}`);
		} else {
			const newRoomId = await createRoom({
				name: "AI Chat",
				chat_type: "ai",
				is_ai: true,
			});
			router.push(`/chat/${newRoomId}`);
		}
	};

	return (
		<div>
			<div className="grid grid-cols-3 gap-2 mb-3">
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => setActiveButton("person")}
					className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
						activeButton === "person"
							? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30"
							: "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
					}`}
				>
					<User className="w-4 h-4" />
					<span>Person</span>
				</motion.button>

				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => setActiveButton("group")}
					className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
						activeButton === "group"
							? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30"
							: "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
					}`}
				>
					<Users className="w-4 h-4" />
					<span>Group</span>
				</motion.button>

				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleCreateAIChat}
					className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700`}
				>
					<Bot className="w-4 h-4" />
					<span>AI Chat</span>
				</motion.button>
			</div>

			{activeButton === "person" ? (
				users && users.length > 0 ? (
					users.map((user) => (
						<motion.div
							key={user.id}
							whileHover={{ scale: 1.02, x: 4 }}
							whileTap={{ scale: 0.98 }}
						>
							<button
								onClick={() => handleCreateRoom(user.id)}
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
				) : users && users.length === 0 ? (
					<p className="text-sm text-gray-500 dark:text-gray-400 px-2">
						{searchQuery ? "No users found" : "No users yet. Start a new chat!"}
					</p>
				) : (
					<p className="text-sm text-gray-500 dark:text-gray-400 px-2">
						{searchQuery ? "No users found" : "No users available."}
					</p>
				)
			) : (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleCreateRoom();
					}}
					className="space-y-4"
				>
					<Input
						type="text"
						value={groupName}
						placeholder="Group Name"
						onChange={(e) => setGroupName(e.target.value)}
						required
						autoFocus
						autoComplete="off"
						className=" border-gray-300 dark:border-gray-700  focus:ring-2 focus:ring-indigo-500 h-10"
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
			)}
		</div>
	);
};

export default NewChat;
