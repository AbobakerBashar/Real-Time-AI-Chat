"use client";

import { useCreateRoom, useRecentRooms } from "@/hooks/useRooms";
import { motion } from "framer-motion";
import { Plus, Share2, MessageSquarePlus, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SelectUserDialog } from "./SelectUserDialog";

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 0.5,
			staggerChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4 },
	},
};

const floatingVariants = {
	animate: {
		y: [0, -10, 0],
		transition: {
			duration: 4,
			repeat: Infinity,
		},
	},
};

export default function ChatEmptyState() {
	const [showSelectionDialog, setShowSelectionDialog] = useState(false);
	const [selectionDialogType, setSelectionDialogType] = useState<
		"person" | "group"
	>("person");

	const { data: recentRooms, isLoading: isLoadingRooms } = useRecentRooms();

	const roomWithAI = recentRooms?.find((room) => room.is_ai);

	const router = useRouter();

	const { mutateAsync: createRoom, isPending: isCreatingRoom } =
		useCreateRoom();

	const handleCreateNewChatAI = async () => {
		if (isLoadingRooms || isCreatingRoom) return;
		if (roomWithAI) {
			router.push(`/chat/${roomWithAI.id}`);
		} else {
			const response = await createRoom({
				name: "AI Chat",
				is_ai: true,
				chat_type: "ai",
			});
			if (response.success && response.roomId)
				router.push(`/chat/${response.roomId}`);
		}
	};

	const handleSelectUser = async (userId: string) => {
		const response = await createRoom({
			name: `${selectionDialogType === "person" ? "Direct" : "Group"}`,
			is_ai: false,
			chat_type: selectionDialogType,
			other_user_id: userId,
		});
		if (response.success && response.roomId)
			router.push(`/chat/${response.roomId}`);
	};

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden"
		>
			{/* Gradient Background */}
			<div className="absolute inset-0 bg-linear-to-br from-gray-50 via-white to-gray-100 dark:bg-linear-to-br dark:from-black dark:via-gray-950 dark:to-gray-900" />

			{/* Radial Gradient Glow */}
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<div className="w-96 h-96 bg-linear-to-r from-indigo-500/10 dark:from-indigo-500/20 via-purple-500/5 dark:via-purple-500/10 to-indigo-500/10 dark:to-indigo-500/20 rounded-full blur-3xl" />
			</div>

			{/* Content */}
			<div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
				{/* Icon */}
				<motion.div variants={itemVariants} className="mb-6">
					<motion.div
						variants={floatingVariants}
						animate="animate"
						className="inline-flex items-center justify-center"
					>
						<div className="w-24 h-24 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/50">
							<MessageSquarePlus className="w-12 h-12 text-white" />
						</div>
					</motion.div>
				</motion.div>

				{/* Hero Message */}
				<motion.div variants={itemVariants} className="mb-2">
					<h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-indigo-600 dark:from-white via-purple-600 dark:via-indigo-200 to-indigo-600 dark:to-purple-200 bg-clip-text text-transparent mb-3">
						Let&rsquo;s Start Chatting!
					</h2>
					<p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
						Select an existing conversation or create a new one to begin. Choose
						from AI assistance, personal chats, or group conversations.
					</p>
				</motion.div>

				{/* Quick Actions */}
				<motion.div
					variants={itemVariants}
					className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
				>
					{/* Create AI Chat */}
					<motion.button
						whileHover={{ scale: 1.05, y: -2 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleCreateNewChatAI}
						disabled={isCreatingRoom || isLoadingRooms}
						className="group relative flex items-center gap-2 lg:gap-3 px-4 lg:px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-all duration-300 shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/70"
					>
						<Zap className="w-5 h-5 group-hover:animate-pulse" />
						<span>AI Chat</span>
					</motion.button>

					{/* Create Person Chat */}
					<motion.button
						whileHover={{ scale: 1.05, y: -2 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => {
							setSelectionDialogType("person");
							setShowSelectionDialog(true);
						}}
						disabled={isCreatingRoom || isLoadingRooms}
						className="group relative flex items-center gap-2 lg:gap-3 px-4 lg:px-8 py-4 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed border border-indigo-300 dark:border-indigo-500/20 hover:border-indigo-400 dark:hover:border-indigo-500/50 rounded-xl font-semibold text-gray-800 dark:text-white transition-all duration-300"
					>
						<Plus className="w-5 h-5" />
						<span>Direct Message</span>
					</motion.button>

					{/* Create Group Chat */}
					<motion.button
						whileHover={{ scale: 1.05, y: -2 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => {
							setSelectionDialogType("group");
							setShowSelectionDialog(true);
						}}
						disabled={isCreatingRoom || isLoadingRooms}
						className="group relative flex items-center gap-2 lg:gap-3 px-4 lg:px-8 py-4 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed border border-purple-300 dark:border-purple-500/20 hover:border-purple-400 dark:hover:border-purple-500/50 rounded-xl font-semibold text-gray-800 dark:text-white transition-all duration-300"
					>
						<Share2 className="w-5 h-5" />
						<span>Group Chat</span>
					</motion.button>
				</motion.div>

				{/* Info Text */}
				<motion.p
					variants={itemVariants}
					className="mt-8 text-sm text-gray-600 dark:text-gray-500"
				>
					💡 Tip: Use the search bar on the left to quickly find existing
					conversations
				</motion.p>
			</div>
			<SelectUserDialog
				isOpen={showSelectionDialog}
				onClose={() => setShowSelectionDialog(false)}
				type={selectionDialogType}
				onSelect={handleSelectUser}
				isLoading={isCreatingRoom}
			/>
		</motion.div>
	);
}
