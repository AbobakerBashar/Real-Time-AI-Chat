import NotificationsActionButtons from "@/components/dashboard/NotificationsActionButtons";
import NotificationSettings from "@/components/dashboard/NotificationSettings";
import NotificationsList from "@/components/dashboard/NotificationsList";

export const metadata = {
	title: "Notifications - Dashboard",
	description: "View and manage your notifications",
};

export const dynamic = "force-dynamic";

interface Notification {
	id: string;
	type: "message" | "like" | "follow";
	title: string;
	description: string;
	timestamp: string;
	read: boolean;
	avatar?: string;
}

const notifications: Notification[] = [
	{
		id: "1",
		type: "message",
		title: "New message from Sarah",
		description: "Hey! How are you doing?",
		timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
		read: false,
		avatar: "S",
	},
	{
		id: "2",
		type: "message",
		title: "Group chat updated",
		description: "You were added to 'Project Team'",
		timestamp: new Date(Date.now() - 30 * 60000).toDateString(), // 30 minutes ago
		read: true,
		avatar: "P",
	},
	{
		id: "3",
		type: "like",
		title: "John liked your message",
		description: "Great idea! I really like it.",
		timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
		read: true,
		avatar: "J",
	},
	{
		id: "4",
		type: "follow",
		title: "Emma started following you",
		description: "New follower",
		timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(), // 1 day ago
		read: true,
		avatar: "E",
	},
	{
		id: "5",
		type: "message",
		title: "AI Assistant response",
		description: "Your query has been processed",
		timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(), // 2 days ago
		read: true,
		avatar: "AI",
	},
];

export default function NotificationsPage() {
	const unreadCount = notifications.filter((n) => !n.read).length;

	return (
		<section>
			{/* Header */}
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

			{/* Action Buttons */}
			<NotificationsActionButtons
				unreadCount={unreadCount}
				totalLength={notifications.length}
			/>

			{/* Notifications List */}
			<NotificationsList notifications={notifications} />

			{/* Notification Settings */}
			<NotificationSettings />
		</section>
	);
}
