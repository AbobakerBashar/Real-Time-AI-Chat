import ChatEmptyState from "@/components/chat/ChatEmptyState";
import Sidebar from "@/components/chat/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Chat",
	description: "Chat with AI or your friends in real-time.",
};

export default function ChatPage() {
	return (
		<div className="h-screen bg-gray-950 dark:bg-gray-950 transition-colors duration-300 flex">
			{/* Sidebar - Conversation List */}
			<Sidebar />

			<div className="ml-80 flex-1 flex flex-col overflow-hidden w-full bg-linear-to-br from-gray-950 via-gray-900 to-black">
				{/* Empty State View */}
				<ChatEmptyState />
			</div>
		</div>
	);
}
