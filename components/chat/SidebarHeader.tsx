"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateRoom } from "@/hooks/useRooms";
import { motion } from "framer-motion";
import { Bot, MessageCirclePlus, Plus, User, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SelectUserDialog } from "./SelectUserDialog";

const SidebarHeader = () => {
	const [showSelectionDialog, setShowSelectionDialog] = useState(false);
	const [selectionDialogType, setSelectionDialogType] = useState<
		"person" | "group"
	>("person");

	const router = useRouter();
	// const [searchQuery, setSearchQuery] = useState("");
	const { mutateAsync: createRoom, isPending: isCreatingRoom } =
		useCreateRoom();

	// Create a new chat room based on the selected type
	const handleCreateNewChat = async (type: "ai" | "person" | "group") => {
		if (type === "ai") {
			const response = await createRoom({
				name: "AI Chat",
				is_ai: true,
				chat_type: "ai",
			});
			if (response.success && response.roomId) {
				router.push(`/chat/${response.roomId}`);
			} else {
				console.error("Failed to create room:", response.error);
			}
		} else {
			setSelectionDialogType(type);
			setShowSelectionDialog(true);
		}
	};

	// Handle user selection from the dialog to create a new chat room
	const handleSelectUser = async (userId: string, userName: string) => {
		const response = await createRoom({
			name: `${selectionDialogType === "person" ? "Direct: " : "Group: "} ${userName}`,
			is_ai: false,
			chat_type: selectionDialogType,
			other_user_id: userId,
		});
		if (response.success && response.roomId) {
			router.push(`/chat/${response.roomId}`);
		} else {
			console.error("Failed to create room:", response.error);
		}
	};

	return (
		<>
			<div className="p-4 border-b border-gray-200 dark:border-white/5">
				<Link href="/" className="flex items-center gap-2 mb-4 group">
					<motion.div
						whileHover={{ scale: 1.1 }}
						className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/50 transition-shadow"
					>
						<MessageCirclePlus className="w-5 h-5 text-white" />
					</motion.div>
					<span className="text-gray-900 dark:text-white font-bold text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
						ChatHub
					</span>
				</Link>

				{/* New Chat Button */}
				<DropdownMenu>
					<DropdownMenuTrigger className="w-full">
						<motion.div
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							// disabled={isCreatingRoom}
							className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
						>
							<Plus className="w-4 h-4" />
							<span>New Chat</span>
						</motion.div>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-56 bg-white dark:bg-gray-950/95 backdrop-blur border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
					>
						<DropdownMenuItem
							onClick={() => handleCreateNewChat("ai")}
							className="cursor-pointer flex items-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-600/50"
						>
							<Bot className="w-4 h-4" />
							<span>AI Chat 🤖</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleCreateNewChat("person")}
							className="cursor-pointer flex items-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-600/50"
						>
							<User className="w-4 h-4" />
							<span>Direct Message 👤</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleCreateNewChat("group")}
							className="cursor-pointer flex items-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-600/50"
						>
							<Users className="w-4 h-4" />
							<span>Group Chat 👥</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<SelectUserDialog
				isOpen={showSelectionDialog}
				onClose={() => setShowSelectionDialog(false)}
				type={selectionDialogType}
				onSelect={handleSelectUser}
				isLoading={isCreatingRoom}
			/>
		</>
	);
};

export default SidebarHeader;
