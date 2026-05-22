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

const ChatHeaderActions = () => {
	const { toggleTheme, theme } = useTheme();
	return (
		<div className="flex items-center gap-0.5 sm:gap-1">
			<Button
				variant="ghost"
				size="sm"
				className="hidden sm:inline-flex hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
				onClick={() => toast.info("Search feature coming soon!")}
				title="Search messages"
			>
				<Search className="w-5 h-5" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				className="hidden md:inline-flex hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
				onClick={() => toast.info("Voice call feature coming soon!")}
				title="Start voice call"
			>
				<Phone className="w-5 h-5" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				className="hidden md:inline-flex hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
				onClick={() => toast.info("Video call feature coming soon!")}
				title="Start video call"
			>
				<Video className="w-5 h-5" />
			</Button>
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
			<Button
				variant="ghost"
				size="sm"
				className="hidden md:inline-flex hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
				onClick={() => toast.info("Notifications settings")}
				title="Notifications"
			>
				<Bell className="w-5 h-5" />
			</Button>
			<Button
				variant="ghost"
				size="sm"
				className="hidden md:inline-flex hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
				onClick={() => toast.info("Room information")}
				title="Room info"
			>
				<Info className="w-5 h-5" />
			</Button>
			<Link href="/dashboard/profile">
				<Button
					variant="ghost"
					size="sm"
					className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
					title="Go to Dashboard"
				>
					<LayoutDashboard className="w-5 h-5" />
				</Button>
			</Link>
			<Button
				variant="ghost"
				size="sm"
				className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
				title="More options"
			>
				<MoreVertical className="w-5 h-5" />
			</Button>
		</div>
	);
};

export default ChatHeaderActions;
