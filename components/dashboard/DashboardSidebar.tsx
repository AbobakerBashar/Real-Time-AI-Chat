"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, User, Settings, Bell } from "lucide-react";
import GoToChat from "../common/GoToChat";

const sidebarItems = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/dashboard/profile", label: "Profile", icon: User },
	{ href: "/dashboard/settings", label: "Settings", icon: Settings },
	{ href: "/dashboard/notifications", label: "Notifications", icon: Bell },
];

export default function DashboardSidebar() {
	const pathname = usePathname();

	return (
		<nav className="space-y-3">
			<GoToChat />

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
							className={`mt-4 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-3 cursor-pointer ${
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
