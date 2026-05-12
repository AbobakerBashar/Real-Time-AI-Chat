"use client";

import { useRecentRooms } from "@/hooks/useRooms";
import { getTimeAgo } from "@/utils/formatTime";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const ConversationsList = () => {
	const searchParamas = useSearchParams();
	const searchQuery = searchParamas.get("search") || "";

	const pathname = usePathname();
	const { data: recentRooms = [], isLoading: isLoadingRooms } =
		useRecentRooms(10);
	// console.log("Recent Rooms:", recentRooms);
	const filteredRooms = useMemo(() => {
		if (!searchQuery.trim()) return recentRooms;
		return recentRooms.filter((room) =>
			room.name?.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [recentRooms, searchQuery]);

	return (
		<div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
			<div className="text-xs text-gray-600 dark:text-gray-500 font-semibold uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
				<Clock className="w-3.5 h-3.5" />
				Recent
			</div>

			{isLoadingRooms ? (
				<div className="space-y-2">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="h-12 bg-gray-200 dark:bg-gray-800/50 rounded-lg animate-pulse"
						/>
					))}
				</div>
			) : filteredRooms.length > 0 ? (
				<div className="space-y-1">
					{filteredRooms.map((room) => {
						const isActive = pathname?.includes(room.id);
						return (
							<motion.div
								key={room.id}
								whileHover={{ scale: 1.02, x: 4 }}
								whileTap={{ scale: 0.98 }}
							>
								<Link
									href={`/chat/${room.id}`}
									className={`block px-3 py-2.5 rounded-lg transition-all duration-200 ${
										isActive
											? "bg-indigo-100 dark:bg-indigo-600/30 text-indigo-900 dark:text-indigo-100"
											: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
									}`}
								>
									<div className="flex items-start gap-2.5">
										{/* Icon */}
										<div className="mt-1 shrink-0">
											{room.is_ai ? (
												<div className="w-2 h-2 bg-indigo-500 rounded-full" />
											) : (
												<div className="w-2 h-2 bg-green-500 rounded-full" />
											)}
										</div>

										{/* Content */}
										<div className="flex-1 min-w-0">
											<div className="flex items-baseline gap-2 justify-between">
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
			) : (
				<div className="flex items-center justify-center h-32 text-center px-2">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						{searchQuery
							? "No conversations found"
							: "No conversations yet\nCreate one to get started!"}
					</p>
				</div>
			)}
		</div>
	);
};

export default ConversationsList;
