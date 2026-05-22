"use client";

import { motion } from "framer-motion";
import { MessageCirclePlus, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const SidebarHeader = () => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const newChat = searchParams.get("new") === "true";

	return (
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

			<div className="grid grid-cols-2 gap-2">
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => router.replace("/chat")}
					className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
						!newChat
							? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30"
							: "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
					}`}
				>
					<User className="w-4 h-4" />
					<span>Recent</span>
				</motion.button>

				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => router.replace("/chat?new=true")}
					className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
						newChat
							? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30"
							: "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
					}`}
				>
					<MessageCirclePlus className="w-4 h-4" />
					<span>New Chat</span>
				</motion.button>
			</div>
		</div>
	);
};

export default SidebarHeader;
