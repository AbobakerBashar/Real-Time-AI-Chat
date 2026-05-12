"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
	LayoutDashboard,
	User,
	Settings,
	Bell,
	MessageSquarePlus,
} from "lucide-react";

const buttonVariants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: (i: number) => ({
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.5,
			delay: 0.5 + i * 0.1,
		},
	}),
	hover: {
		scale: 1.08,
		transition: { duration: 0.2 },
	},
	tap: { scale: 0.95 },
};

const sidebarItems = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/dashboard/account", label: "Account", icon: User },
	{ href: "/dashboard/settings", label: "Settings", icon: Settings },
	{ href: "/dashboard/notifications", label: "Notifications", icon: Bell },
];

export default function DashboardSidebar() {
	const pathname = usePathname();

	return (
		<nav className="space-y-1">
			<motion.div
				variants={buttonVariants}
				initial="hidden"
				animate="visible"
				custom={0}
				whileHover="hover"
				whileTap="tap"
			>
				<Link
					href="/chat"
					className="flex items-center gap-2 px-6 py-2 bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/30 duration-300"
				>
					<MessageSquarePlus className="w-4 h-4" />
					Chat
				</Link>
			</motion.div>
			;
			{sidebarItems.map((item) => {
				const Icon = item.icon;
				const isActive =
					pathname === item.href ||
					(item.href !== "/dashboard" && pathname.startsWith(item.href));

				return (
					<Link key={item.href} href={item.href}>
						<motion.div
							whileHover={{ x: 4 }}
							whileTap={{ scale: 0.98 }}
							className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 cursor-pointer ${
								isActive
									? "bg-indigo-100 dark:bg-indigo-600/30 text-indigo-900 dark:text-indigo-100"
									: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
							}`}
						>
							<Icon className="w-5 h-5" />
							<span className="font-medium">{item.label}</span>
						</motion.div>
					</Link>
				);
			})}
		</nav>
	);
}
