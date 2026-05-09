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
		<div className="h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black transition-colors duration-300 flex">
			{/* Sidebar - Room List */}
			<Sidebar />

			{/* Main Chat Area - adjusted for fixed sidebar */}
			<div className="ml-80 flex-1 flex flex-col overflow-hidden w-full">
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
