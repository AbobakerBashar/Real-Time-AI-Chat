"use client";

import { useTheme } from "@/components/common/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Menu, MessageSquare, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const headerVariants = {
	hidden: { opacity: 0, y: -20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
		},
	},
};

const MobileHeader = ({
	avatarUrl,
	username,
}: {
	avatarUrl: string;
	username: string;
}) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { toggleTheme, theme } = useTheme();

	return (
		<motion.div
			variants={headerVariants}
			initial="hidden"
			animate="visible"
			className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 sm:p-4 transition-colors duration-300 h-auto shrink-0 md:hidden"
		>
			<header className="flex items-center justify-between gap-3">
				{/* Mobile Menu Button */}
				<button
					className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors p-2 rounded-md"
					onClick={() => setIsMobileMenuOpen(true)}
					title="Open conversations"
				>
					<Menu className="w-6 h-6" />
				</button>

				<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
					{/* <SheetHeader className="relative z-50" /> */}
					<SheetContent side="left" className="w-80 p-0">
						<Sidebar isMobile={true} />
					</SheetContent>
				</Sheet>

				{/* Logo / Title */}
				<div className="flex items-center gap-2 flex-1 min-w-0">
					<div className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-600 to-purple-600 flex items-center justify-center shrink-0">
						<MessageSquare className="w-5 h-5 text-white" />
					</div>
					<div className="min-w-0">
						<h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
							ChatHub
						</h1>
						<p className="text-xs text-muted-foreground truncate">
							Real-time messaging
						</p>
					</div>
				</div>

				{/* Right Actions */}
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="sm"
						className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						onClick={toggleTheme}
						title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
					>
						{theme === "light" ? (
							<Moon className="w-5 h-5" />
						) : (
							<Sun className="w-5 h-5" />
						)}
					</Button>
					<Link href="/dashboard/profile">
						<Avatar className="hover:border-2 border-primary">
							<AvatarImage src={avatarUrl} alt={username} />
							<AvatarFallback>
								{username.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						{/* </Button> */}
					</Link>
				</div>
			</header>
		</motion.div>
	);
};

export default MobileHeader;
