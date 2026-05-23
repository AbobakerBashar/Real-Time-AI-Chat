"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
	Bell,
	Info,
	LayoutDashboard,
	Moon,
	MoreVertical,
	Phone,
	Search,
	Sun,
	Video,
} from "lucide-react";
import { useTheme } from "../common/ThemeProvider";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "../ui/dropdown-menu";

const ChatHeaderActions = () => {
	const { toggleTheme, theme } = useTheme();
	const [isOpen, setIsOpen] = useState(false);

	const handleMoreAction = (action: () => void) => {
		action();
		setIsOpen(false);
	};

	return (
		<div className="flex items-center gap-0.5 sm:gap-1">
			{/* Theme Toggle - Always Visible */}
			<Button
				variant="ghost"
				size="sm"
				className="transition-colors"
				onClick={toggleTheme}
				title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
			>
				{theme === "light" ? (
					<Moon className="w-5 h-5" />
				) : (
					<Sun className="w-5 h-5" />
				)}
			</Button>

			{/* Dashboard - Always Visible */}
			<Link href="/dashboard/profile">
				<Button
					variant="ghost"
					size="sm"
					className="transition-colors"
					title="Go to Dashboard"
				>
					<LayoutDashboard className="w-5 h-5" />
				</Button>
			</Link>

			{/* More Options Dropdown */}
			<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenuTrigger title="More options">
					<MoreVertical className="w-5 h-5" />
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					sideOffset={8}
					className="w-48 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
				>
					{/* Search */}
					<DropdownMenuItem
						onSelect={() =>
							handleMoreAction(() => toast.info("Search feature coming soon!"))
						}
						className="hover:bg-gray-50 dark:hover:bg-gray-600/40"
					>
						<Search className="w-4 h-4 mr-2" />
						<span>Search Messages</span>
					</DropdownMenuItem>

					{/* Voice Call */}
					<DropdownMenuItem
						onSelect={() =>
							handleMoreAction(() =>
								toast.info("Voice call feature coming soon!"),
							)
						}
						className="hover:bg-gray-50 dark:hover:bg-gray-600/40"
					>
						<Phone className="w-4 h-4 mr-2" />
						<span>Voice Call</span>
					</DropdownMenuItem>

					{/* Video Call */}
					<DropdownMenuItem
						onSelect={() =>
							handleMoreAction(() =>
								toast.info("Video call feature coming soon!"),
							)
						}
						className="hover:bg-gray-50 dark:hover:bg-gray-600/40"
					>
						<Video className="w-4 h-4 mr-2" />
						<span>Video Call</span>
					</DropdownMenuItem>

					{/* Notifications */}
					<DropdownMenuItem
						onSelect={() =>
							handleMoreAction(() => toast.info("Notifications settings"))
						}
						className="hover:bg-gray-50 dark:hover:bg-gray-600/40"
					>
						<Bell className="w-4 h-4 mr-2" />
						<span>Notifications</span>
					</DropdownMenuItem>

					{/* Room Info */}
					<DropdownMenuItem
						onSelect={() =>
							handleMoreAction(() => toast.info("Room information"))
						}
						className="hover:bg-gray-50 dark:hover:bg-gray-600/40"
					>
						<Info className="w-4 h-4 mr-2" />
						<span>Room Info</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default ChatHeaderActions;
