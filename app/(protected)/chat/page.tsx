import ChatEmptyState from "@/components/chat/ChatEmptyState";
import MobileHeader from "@/components/chat/MobileHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Chat",
	description: "Chat with AI or your friends in real-time.",
};

export default function ChatPage() {
	return (
		<div className="h-screen bg-white dark:bg-gray-950 transition-colors duration-300 flex-1 flex flex-col overflow-hidden w-full bg-linear-to-br from-gray-50 via-white to-gray-100 dark:bg-linear-to-br dark:from-gray-950 dark:via-gray-900 dark:to-black">
			{/* Mobile Header */}
			<MobileHeader />

			{/* Empty State View */}
			<ChatEmptyState />
		</div>
	);
}
