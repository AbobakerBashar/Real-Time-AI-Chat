"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NotificationsActionButtonsProps {
	unreadCount: number;
	totalLength: number;
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const NotificationsActionButtons = ({
	unreadCount,
	totalLength,
}: NotificationsActionButtonsProps) => {
	const router = useRouter();
	const [filter, setFilter] = useState<"all" | "unread">("all");

	const handleMarkAllAsRead = () => {};

	const handleClearAll = () => {};

	return (
		<motion.div variants={itemVariants} className="flex flex-wrap gap-2">
			<Button
				variant={filter === "all" ? "default" : "outline"}
				onClick={() => {
					router.replace("/dashboard/notifications?filter=all");
					setFilter("all");
				}}
			>
				All Notifications
			</Button>
			<Button
				variant={filter === "unread" ? "default" : "outline"}
				onClick={() => {
					router.replace("/dashboard/notifications?filter=unread");
					setFilter("unread");
				}}
			>
				Unread ({unreadCount})
			</Button>
			{totalLength > 0 && (
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
	);
};

export default NotificationsActionButtons;
