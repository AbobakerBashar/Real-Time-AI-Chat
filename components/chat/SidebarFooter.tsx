"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import LogoutButton from "../common/LogoutButton";
import { useTheme } from "../common/ThemeProvider";

const SidebarFooter = () => {
	const { toggleTheme, theme } = useTheme();
	const router = useRouter();
	return (
		<div className="p-3 border-t border-gray-200 dark:border-white/15 space-y-1 relative z-50">
			<motion.div
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				onTap={() => router.push("/dashboard")}
				aria-label="Go to dashboard page"
				className="w-full cursor-pointer text-left text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/5 transition-colors duration-200 flex items-center gap-2 group"
			>
				<LayoutDashboard className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
				<span>Dashboard</span>
			</motion.div>
			<motion.button
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				onClick={toggleTheme}
				title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
				className="w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/5 transition-all duration-200 flex items-center gap-2 group"
			>
				{theme === "light" ? (
					<>
						<Moon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
						<span>Dark Mode</span>
					</>
				) : (
					<>
						<Sun className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
						<span>Light Mode</span>
					</>
				)}
			</motion.button>
			<LogoutButton className="w-full" size="lg" />
		</div>
	);
};

export default SidebarFooter;
