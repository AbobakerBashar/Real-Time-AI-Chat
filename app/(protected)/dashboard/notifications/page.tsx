"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
	Bell,
	Trash2,
	CheckCircle,
	MessageSquare,
	Heart,
	UserPlus,
	Clock,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface Notification {
	id: string;
	type: "message" | "like" | "follow";
	title: string;
	description: string;
	timestamp: Date;
	read: boolean;
	avatar?: string;
}

const mockNotifications: Notification[] = [
	{
		id: "1",
		type: "message",
		title: "New message from Sarah",
		description: "Hey! How are you doing?",
		timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
		read: false,
		avatar: "S",
	},
	{
		id: "2",
		type: "message",
		title: "Group chat updated",
		description: "You were added to 'Project Team'",
		timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
		read: true,
		avatar: "P",
	},
	{
		id: "3",
		type: "like",
		title: "John liked your message",
		description: "Great idea! I really like it.",
		timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
		read: true,
		avatar: "J",
	},
	{
		id: "4",
		type: "follow",
		title: "Emma started following you",
		description: "New follower",
		timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000), // 1 day ago
		read: true,
		avatar: "E",
	},
	{
		id: "5",
		type: "message",
		title: "AI Assistant response",
		description: "Your query has been processed",
		timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
		read: true,
		avatar: "AI",
	},
];

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

function formatTime(date: Date): string {
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);

	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	if (days < 7) return `${days}d ago`;
	return date.toLocaleDateString();
}

export default function NotificationsPage() {
	const [notifications, setNotifications] =
		useState<Notification[]>(mockNotifications);
	const [filter, setFilter] = useState<"all" | "unread">("all");

	const filteredNotifications =
		filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

	const unreadCount = notifications.filter((n) => !n.read).length;

	const handleMarkAsRead = (id: string) => {
		setNotifications(
			notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
		);
	};

	const handleMarkAllAsRead = () => {
		setNotifications(notifications.map((n) => ({ ...n, read: true })));
		toast.success("All notifications marked as read");
	};

	const handleDelete = (id: string) => {
		setNotifications(notifications.filter((n) => n.id !== id));
		toast.success("Notification deleted");
	};

	const handleClearAll = () => {
		setNotifications([]);
		toast.success("All notifications cleared");
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-6"
		>
			{/* Header */}
			<motion.div variants={itemVariants}>
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
							Notifications
						</h1>
						<p className="text-gray-600 dark:text-gray-400 mt-1">
							Stay updated with your messages and activities
						</p>
					</div>
					{unreadCount > 0 && (
						<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 w-fit">
							{unreadCount} unread
						</span>
					)}
				</div>
			</motion.div>

			{/* Action Buttons */}
			<motion.div variants={itemVariants} className="flex flex-wrap gap-2">
				<Button
					variant={filter === "all" ? "default" : "outline"}
					onClick={() => setFilter("all")}
				>
					All Notifications
				</Button>
				<Button
					variant={filter === "unread" ? "default" : "outline"}
					onClick={() => setFilter("unread")}
				>
					Unread ({unreadCount})
				</Button>
				{notifications.length > 0 && (
					<>
						<Button
							variant="outline"
							onClick={handleMarkAllAsRead}
							disabled={unreadCount === 0}
						>
							<CheckCircle className="w-4 h-4 mr-2" />
							Mark all as read
						</Button>
						<Button
							variant="outline"
							onClick={handleClearAll}
							className="text-red-600 dark:text-red-400"
						>
							<Trash2 className="w-4 h-4 mr-2" />
							Clear all
						</Button>
					</>
				)}
			</motion.div>

			{/* Notifications List */}
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
								<div className="flex-shrink-0">
									<div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
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
												{formatTime(notification.timestamp)}
											</div>
										</div>

										{/* Delete Button */}
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(notification.id);
											}}
											className="flex-shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
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

			{/* Notification Settings */}
			<motion.div variants={itemVariants}>
				<Card>
					<CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
						<h2 className="text-lg font-bold text-gray-900 dark:text-white">
							Notification Preferences
						</h2>
					</CardHeader>
					<CardContent className="pt-6 space-y-4">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Go to Settings to customize which notifications you receive
						</p>
						<Button variant="outline" className="w-full md:w-auto">
							Go to Settings
						</Button>
					</CardContent>
				</Card>
			</motion.div>
		</motion.div>
	);
}
