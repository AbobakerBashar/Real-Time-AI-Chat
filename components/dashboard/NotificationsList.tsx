"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getTimeAgo } from "@/utils/formatTime";
import { motion } from "framer-motion";
import {
	Bell,
	Clock,
	Heart,
	MessageSquare,
	Trash2,
	UserPlus,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Notification {
	id: string;
	type: "message" | "like" | "follow";
	title: string;
	description: string;
	timestamp: string;
	read: boolean;
	avatar?: string;
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function getNotificationIcon(type: string) {
	switch (type) {
		case "message":
			return <MessageSquare className="w-5 h-5 text-blue-500" />;
		case "like":
			return <Heart className="w-5 h-5 text-red-500" />;
		case "follow":
			return <UserPlus className="w-5 h-5 text-green-500" />;
		default:
			return <Bell className="w-5 h-5 text-gray-500" />;
	}
}

const NotificationsList = ({
	notifications,
}: {
	notifications: Notification[];
}) => {
	const searchParams = useSearchParams();
	const filter = searchParams.get("filter");

	const filteredNotifications =
		filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

	const handleMarkAsRead = (id: string) => {
		// Logic to mark notification as read
	};

	const handleDelete = (id: string) => {
		// Logic to delete notification
	};

	return (
		<>
			{filteredNotifications.length > 0 ? (
				<motion.div variants={itemVariants} className="space-y-3">
					{filteredNotifications.map((notification, index) => (
						<motion.div
							key={notification.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.05 }}
							whileHover={{ scale: 1.01, x: 4 }}
							className={`p-4 rounded-lg border transition-all cursor-pointer ${
								!notification.read
									? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50"
									: "hover:bg-gray-50 dark:hover:bg-white/5 border-gray-200 dark:border-white/10"
							}`}
							onClick={() => handleMarkAsRead(notification.id)}
						>
							<div className="flex items-start gap-4">
								{/* Avatar */}
								<div className="shrink-0">
									<div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
										{notification.avatar}
									</div>
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between gap-2">
										<div className="flex-1">
											<div className="flex items-center gap-2">
												{getNotificationIcon(notification.type)}
												<h3 className="font-semibold text-gray-900 dark:text-white">
													{notification.title}
												</h3>
												{!notification.read && (
													<div className="w-2 h-2 rounded-full bg-indigo-600" />
												)}
											</div>
											<p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
												{notification.description}
											</p>
											<div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-500">
												<Clock className="w-3 h-3" />
												{getTimeAgo(notification.timestamp)}
											</div>
										</div>

										{/* Delete Button */}
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(notification.id);
											}}
											className="shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
											title="Delete notification"
										>
											<Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>
			) : (
				<motion.div variants={itemVariants}>
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12">
							<Bell className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								No notifications
							</h3>
							<p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
								{filter === "unread"
									? "You're all caught up! No unread notifications."
									: "You don't have any notifications yet. When you receive messages or activities, they'll appear here."}
							</p>
						</CardContent>
					</Card>
				</motion.div>
			)}
		</>
	);
};

export default NotificationsList;
