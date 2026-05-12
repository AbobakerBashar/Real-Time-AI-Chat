import Header from "@/components/chat/Header";
import InputArea from "@/components/chat/InputArea";
import MessagesContainer from "@/components/chat/MessagesContainer";
import Sidebar from "@/components/chat/Sidebar";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Chat Room",
	description: "Engage in real-time conversations with AI or your friends.",
};

export default async function ChatRoomPage({
	params,
}: {
	params: Promise<{ roomId: string }>;
}) {
	const { roomId } = await params;

	return (
		<div className="h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:bg-linear-to-br dark:from-gray-950 dark:via-gray-900 dark:to-black transition-colors duration-300 flex flex-col md:flex-row">
			{/* Sidebar - Room List - Hidden on mobile, fixed on desktop */}
			<div className="hidden md:block md:w-80 md:fixed md:left-0 md:top-0 md:h-screen md:z-40">
				<Sidebar />
			</div>

			{/* Main Chat Area - adjusted for fixed sidebar */}
			<div className="flex-1 flex flex-col overflow-hidden w-full md:ml-80">
				{/* Header */}
				<Header roomId={roomId} />

				{/* Messages Container - Scrollable */}
				<Suspense>
					<MessagesContainer roomId={roomId} />
				</Suspense>

				{/* Input Area - Fixed Bottom */}
				<InputArea roomId={roomId} />
			</div>
		</div>
	);
}
