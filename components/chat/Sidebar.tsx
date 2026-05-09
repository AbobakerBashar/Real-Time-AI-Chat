"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SelectUserDialog } from "@/components/chat/SelectUserDialog";
import { useCreateRoom } from "@/hooks/useRooms";
import { motion } from "framer-motion";
import {
	MessageCirclePlus,
	Bot,
	Users,
	User,
	Search,
	Plus,
	Settings,
	HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// interface Conversation {
// 	id: string;
// 	title: string;
// 	timestamp: Date;
// 	isActive: boolean;
// }

const sidebarVariants = {
	hidden: { x: -300, opacity: 0 },
	visible: {
		x: 0,
		opacity: 1,
		transition: {
			duration: 0.4,
		},
	},
};

const Sidebar = () => {
	const [showSelectionDialog, setShowSelectionDialog] = useState(false);
	const [selectionDialogType, setSelectionDialogType] = useState<
		"person" | "group"
	>("person");

	const [searchQuery, setSearchQuery] = useState("");
	const { mutateAsync: createRoom, isPending: isCreatingRoom } =
		useCreateRoom();

	const router = useRouter();

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
			<aside className="h-screen w-80 fixed left-0 top-0 z-40">
				{/* Glassmorphism Background */}
				<div className="absolute inset-0 bg-linear-to-br from-gray-950/80 via-gray-900/70 to-black/80 backdrop-blur-xl border-r border-white/5" />

				{/* Darker background layer */}
				<div className="absolute inset-0 bg-black/40" />

				{/* Content */}
				<motion.div
					variants={sidebarVariants}
					initial="hidden"
					animate="visible"
					className="h-full flex flex-col relative z-10"
				>
					{/* Header Section with Logo */}
					<div className="p-4 border-b border-white/5">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
								<MessageCirclePlus className="w-5 h-5 text-white" />
							</div>
							<span className="text-white font-bold text-lg">ChatHub</span>
						</div>

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
								className="w-56 bg-gray-950/95 backdrop-blur border border-white/10"
							>
								<DropdownMenuItem
									onClick={() => handleCreateNewChat("ai")}
									className="cursor-pointer flex items-center gap-2 text-white hover:bg-indigo-600/50"
								>
									<Bot className="w-4 h-4" />
									<span>AI Chat 🤖</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleCreateNewChat("person")}
									className="cursor-pointer flex items-center gap-2 text-white hover:bg-indigo-600/50"
								>
									<User className="w-4 h-4" />
									<span>Direct Message 👤</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleCreateNewChat("group")}
									className="cursor-pointer flex items-center gap-2 text-white hover:bg-indigo-600/50"
								>
									<Users className="w-4 h-4" />
									<span>Group Chat 👥</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Search Bar */}
					<div className="px-3 py-4 border-b border-white/5">
						<div className="relative group">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors pointer-events-none" />
							<input
								type="text"
								placeholder="Search conversations..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:bg-white/10 text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
								style={{ colorScheme: "dark" }}
							/>
						</div>
					</div>

					{/* Conversations List */}
					<div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
						<div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3 px-2">
							Recent
						</div>
						{/* Placeholder for rooms - will be populated later */}
						<div className="flex items-center justify-center h-32 text-center px-2">
							<p className="text-sm text-gray-400">
								No conversations yet
								<br />
								Create one to get started!
							</p>
						</div>
					</div>

					{/* Footer Section */}
					<div className="p-3 border-t border-white/5 space-y-1">
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="w-full text-left text-sm text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-200 flex items-center gap-2 group"
						>
							<Settings className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-colors" />
							<span>Settings</span>
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="w-full text-left text-sm text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-200 flex items-center gap-2 group"
						>
							<HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-colors" />
							<span>Help & Support</span>
						</motion.button>
					</div>
				</motion.div>
			</aside>

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

export default Sidebar;
