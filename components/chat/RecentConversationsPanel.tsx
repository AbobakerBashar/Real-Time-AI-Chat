"use client";

import { useRecentRooms } from "@/hooks/useRooms";
import { getTimeAgo } from "@/utils/formatTime";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface RecentConversationsPanelProps {
	type: "person" | "group" | "recent";
}

export const RecentConversationsPanel = ({
	type,
}: RecentConversationsPanelProps) => {
	const pathname = usePathname();
	const { data: recentRooms = [], isLoading: isLoadingRooms } =
		useRecentRooms(10);

	// Filter rooms by type
	const filteredRooms = useMemo(() => {
		return recentRooms.filter((room) => {
			if (type === "person") {
				return room.name === "Direct";
			} else if (type === "group") {
				return room.name === "Group";
			}
			return false;
		});
	}, [recentRooms, type]);

	if (isLoadingRooms) {
		return (
			<div className="mt-3 space-y-2">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="h-12 bg-gray-200 dark:bg-gray-800/50 rounded-lg animate-pulse"
					/>
				))}
			</div>
		);
	}

	if (filteredRooms.length === 0) {
		return (
			<div className="mt-3 text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
				No recent {type} conversations
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			className="mt-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
		>
			<div className="px-3 py-2 text-xs text-gray-600 dark:text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-2 border-b border-gray-200 dark:border-gray-800">
				<Clock className="w-3.5 h-3.5" />
				Recent {type}
			</div>
			<div className="space-y-1 p-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
				{filteredRooms.map((room) => {
					const isActive = pathname?.includes(room.id);
					return (
						<motion.div
							key={room.id}
							whileHover={{ scale: 1.02, x: 2 }}
							whileTap={{ scale: 0.98 }}
						>
							<Link
								href={`/chat/${room.id}`}
								className={`block px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
									isActive
										? "bg-indigo-100 dark:bg-indigo-600/30 text-indigo-900 dark:text-indigo-100"
										: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
								}`}
							>
								<div className="flex items-start gap-2">
									<div className="mt-0.5 shrink-0">
										<div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-baseline gap-1 justify-between">
											<p className="font-medium text-sm truncate">
												{room.name}
											</p>
											{room.last_message_at && (
												<span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap shrink-0">
													{getTimeAgo(room.last_message_at)}
												</span>
											)}
										</div>
										{room.last_message && (
											<p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">
												{room.last_message}
											</p>
										)}
									</div>
								</div>
							</Link>
						</motion.div>
					);
				})}
			</div>
		</motion.div>
	);
};
