"use client";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useAuth";
import { useGetRoomMembers } from "@/hooks/useRooms";
import { Member } from "@/types/auth";
import { motion } from "framer-motion";
import { Bell, Info, MoreVertical, Phone, Search, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const headerVariants = {
	hidden: { opacity: 0, y: -20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
		},
	},
};

const Header = ({ roomId }: { roomId: string }) => {
	const [isOnline] = useState(true);
	const { data: currentUser, isLoading: isCurrentUserLoading } =
		useCurrentUser();
	const { data: roomMembers, isLoading: isLoadingMembers } =
		useGetRoomMembers(roomId);

	const isLoading = isCurrentUserLoading || isLoadingMembers;

	const receiver: Member | null = roomMembers
		? roomMembers.find((member) => member.id !== currentUser?.id) || null
		: null;

	return (
		<motion.div
			variants={headerVariants}
			initial="hidden"
			animate="visible"
			className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 transition-colors duration-300 h-18 shrink-0"
		>
			<header className="max-w-4xl px-6 flex items-center justify-between">
				<div className="flex items-center gap-4 flex-1">
					<motion.div
						whileHover={{ scale: 1.05 }}
						className="w-12 h-12 rounded-full bg-linear-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 flex items-center justify-center select-none"
					>
						{receiver ? (
							<Avatar>
								<AvatarFallback>
									{receiver.full_name
										? receiver.full_name.charAt(0).toUpperCase()
										: "U"}
								</AvatarFallback>
								{receiver.avatar_url && (
									<AvatarImage src={receiver.avatar_url} />
								)}
							</Avatar>
						) : (
							<span className="text-white font-bold text-lg">AI</span>
						)}
					</motion.div>
					<div>
						{isLoading ? (
							<div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1" />
						) : receiver ? (
							<>
								<h1 className="text-xl font-bold text-gray-900 dark:text-white">
									{receiver.full_name || receiver.username || "Unknown User"}
								</h1>
								<p
									className={`text-sm flex items-center gap-1 ${
										isOnline
											? "text-green-600 dark:text-green-400"
											: "text-gray-500 dark:text-gray-400"
									}`}
								>
									<span
										className={`w-2 h-2 rounded-full ${
											isOnline
												? "bg-green-600 dark:bg-green-400"
												: "bg-gray-500 dark:bg-gray-400"
										}`}
									/>
									{isOnline ? "Active now" : "Away"}
								</p>
							</>
						) : (
							<>
								<h1 className="text-xl font-bold text-gray-900 dark:text-white">
									ChatAI Assistant
								</h1>
								<p
									className={`text-sm flex items-center gap-1 ${
										isOnline
											? "text-green-600 dark:text-green-400"
											: "text-gray-500 dark:text-gray-400"
									}`}
								>
									<span
										className={`w-2 h-2 rounded-full ${
											isOnline
												? "bg-green-600 dark:bg-green-400"
												: "bg-gray-500 dark:bg-gray-400"
										}`}
									/>
									{isOnline ? "Active now" : "Away"}
								</p>
							</>
						)}
					</div>
				</div>

				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="sm"
						className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						onClick={() => toast.info("Search feature coming soon!")}
						title="Search messages"
					>
						<Search className="w-5 h-5" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						onClick={() => toast.info("Voice call feature coming soon!")}
						title="Start voice call"
					>
						<Phone className="w-5 h-5" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						onClick={() => toast.info("Video call feature coming soon!")}
						title="Start video call"
					>
						<Video className="w-5 h-5" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						onClick={() => toast.info("Notifications settings")}
						title="Notifications"
					>
						<Bell className="w-5 h-5" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						onClick={() => toast.info("Room information")}
						title="Room info"
					>
						<Info className="w-5 h-5" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						title="More options"
					>
						<MoreVertical className="w-5 h-5" />
					</Button>
				</div>
			</header>
		</motion.div>
	);
};

export default Header;
