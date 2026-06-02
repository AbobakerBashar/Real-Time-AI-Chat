import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { RecentRoom } from "@/types/rooms";
import { getTimeAgo } from "@/utils/formatTime";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Conversations = ({ rooms }: { rooms: RecentRoom[] }) => {
	const pathname = usePathname();

	return (
		<div className="space-y-1">
			{rooms.map((room) => {
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
							<div className="flex items-center gap-2.5">
								{/* Icon */}
								<div className="mt-1 shrink-0">
									{room.chat_type === "ai" ? (
										<div className="w-2 h-2 bg-indigo-500 rounded-full" />
									) : (
										<Avatar className="w-8 h-8">
											{room.avatar_url && (
												<AvatarImage
													src={room.avatar_url}
													alt={room.name || "Avatar"}
												/>
											)}
											<AvatarFallback>
												{room.chat_type === "group"
													? "👥"
													: room.name
														? room.name.charAt(0).toUpperCase()
														: "👤"}
											</AvatarFallback>
										</Avatar>
									)}
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0">
									<div className="flex items-baseline gap-2 justify-between">
										<p className="font-medium text-sm truncate">
											{room.chat_type === "group"
												? room.name || "Unnamed Group"
												: room.username || room.full_name || "Unnamed Chat"}
											{room.chat_type !== "ai" && (
												<span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
													{room.sent_by_current_user ? "(You)" : ""}
												</span>
											)}
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
	);
};

export default Conversations;
