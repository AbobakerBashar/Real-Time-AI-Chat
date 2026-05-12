"use client";

import { useTheme } from "@/components/common/ThemeProvider";
import { useCurrentUser } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { MessageCirclePlus, Moon, Sun, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/common/LogoutButton";

const headerVariants = {
	hidden: { opacity: 0, y: -20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4 },
	},
};

export default function DashboardHeader() {
	const { toggleTheme, theme } = useTheme();
	const { data: user } = useCurrentUser();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<motion.header
			variants={headerVariants}
			initial="hidden"
			animate="visible"
			className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-white/10 shadow-sm"
		>
			<div className="px-4 md:px-6 py-3 md:py-4">
				<div className="flex items-center justify-between gap-4">
					{/* Logo and Brand */}
					<Link href="/" className="flex items-center gap-2.5 group shrink-0">
						<motion.div
							whileHover={{ scale: 1.05 }}
							className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/30 transition-shadow"
						>
							<MessageCirclePlus className="w-5 h-5 text-white" />
						</motion.div>
						<span className="hidden sm:inline font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
							ChatHub
						</span>
					</Link>

					{/* Right Section */}
					<div className="flex items-center gap-2 md:gap-3">
						{/* Theme Toggle */}
						<Button
							onClick={toggleTheme}
							variant="ghost"
							size="icon"
							className="rounded-lg"
							title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
						>
							{theme === "light" ? (
								<Moon className="w-4 h-4" />
							) : (
								<Sun className="w-4 h-4" />
							)}
						</Button>

						{/* User Profile */}

						<Link
							href="/dashboard/profile"
							className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
						>
							<Avatar size="sm">
								<AvatarImage src="" alt="Profile" />
								<AvatarFallback className="text-xs font-semibold">
									{user?.email?.charAt(0).toUpperCase() || "U"}
								</AvatarFallback>
							</Avatar>
							<div className="hidden lg:block text-left">
								<p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
									{user?.email?.split("@")[0] || "Profile"}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									Account
								</p>
							</div>
						</Link>

						{/* Logout Button - Desktop */}
						<div className="hidden md:block">
							<LogoutButton />
						</div>

						{/* Mobile Menu Toggle */}
						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
						>
							{isMobileMenuOpen ? (
								<X className="w-5 h-5" />
							) : (
								<Menu className="w-5 h-5" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Navigation Menu */}
				{isMobileMenuOpen && (
					<motion.nav
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="md:hidden border-t border-gray-200 dark:border-white/10 mt-3 pt-3 space-y-1"
					>
						<Link
							href="/chat"
							className="flex items-center gap-2 px-6 py-2 bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/30 duration-300"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Chat
						</Link>
						<Link
							href="/dashboard"
							className="block px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Dashboard
						</Link>
						<Link
							href="/dashboard/profile"
							className="block px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Profile
						</Link>
						<Link
							href="/dashboard/account"
							className="block px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Account
						</Link>
						<Link
							href="/dashboard/settings"
							className="block px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Settings
						</Link>
						<Link
							href="/dashboard/notifications"
							className="block px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Notifications
						</Link>
						<div className="md:hidden pt-2 border-t border-gray-200 dark:border-white/10">
							<div className="px-3">
								<LogoutButton />
							</div>
						</div>
					</motion.nav>
				)}
			</div>
		</motion.header>
	);
}
