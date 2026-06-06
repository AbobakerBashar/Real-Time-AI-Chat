"use client";

import { useTheme } from "@/components/common/ThemeProvider";
import { motion } from "framer-motion";
import {
	MessageCirclePlus,
	Moon,
	Sun,
	Menu,
	X,
	LayoutDashboard,
	User,
	Settings,
	Bell,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/common/LogoutButton";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
} from "@/components/ui/sheet";
import { UserProfile } from "@/types/auth";
import Logo from "../common/Logo";
import { usePathname } from "next/navigation";
import GoToChat from "../common/GoToChat";

const headerVariants = {
	hidden: { opacity: 0, y: -20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4 },
	},
};

const isActive = (pathname: string, href: string) => {
	return pathname === href;
};

export default function DashboardHeader({
	profile,
}: {
	profile: UserProfile | null;
}) {
	const { toggleTheme, theme } = useTheme();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const pathname = usePathname();

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
							<Avatar>
								<AvatarImage
									src={profile?.avatar_url || ""}
									alt={profile?.username || profile?.full_name || "Profile"}
								/>
								<AvatarFallback className="text-xs font-semibold">
									{profile?.email?.charAt(0).toUpperCase() || "U"}
								</AvatarFallback>
							</Avatar>
							<div className="hidden lg:block text-left">
								<p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
									{profile?.username ||
										profile?.full_name?.split(" ")[0] ||
										"Profile"}
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
				<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
					<SheetContent side="left" className="w-3/4 sm:w-1/2 md:hidden">
						<SheetHeader>
							<Link href="/" className="w-fit">
								<Logo />
							</Link>
						</SheetHeader>

						<motion.nav
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="md:hidden border-t border-gray-200 dark:border-white/10 mt-3 pt-3 space-y-1 px-4"
						>
							<GoToChat className="mb-2" />
							<Link
								href="/dashboard"
								className={`flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${isActive(pathname, "/dashboard") ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<LayoutDashboard className="w-5 h-5" />
								Dashboard
							</Link>
							<Link
								href="/dashboard/profile"
								className={`px-3 py-2.5 rounded-lg  hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex items-center gap-2 ${isActive(pathname, "/dashboard/profile") ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<Avatar className="w-5 h-5 inline-block">
									<AvatarImage
										src={profile?.avatar_url || ""}
										alt={profile?.username || profile?.full_name || "Profile"}
									/>
									<AvatarFallback className="text-xs font-semibold">
										{profile?.email?.charAt(0).toUpperCase() || "U"}
									</AvatarFallback>
								</Avatar>
								Profile
							</Link>
							<Link
								href="/dashboard/account"
								className={`flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${isActive(pathname, "/dashboard/account") ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<User className="w-5 h-5" />
								Account
							</Link>
							<Link
								href="/dashboard/settings"
								className={`flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${isActive(pathname, "/dashboard/settings") ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<Settings className="w-5 h-5" />
								Settings
							</Link>
							<Link
								href="/dashboard/notifications"
								className={`flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${isActive(pathname, "/dashboard/notifications") ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<Bell className="w-5 h-5" />
								Notifications
							</Link>
						</motion.nav>
						<SheetFooter className="pt-2 border-t border-gray-200 dark:border-white/10">
							<LogoutButton size="lg" className="w-full" />
						</SheetFooter>
					</SheetContent>
				</Sheet>
			</div>
		</motion.header>
	);
}
