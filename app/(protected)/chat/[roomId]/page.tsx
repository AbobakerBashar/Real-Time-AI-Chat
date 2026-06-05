import { UUID_REGEX } from "@/utils/validate";

import { getRoomDetails } from "@/actions/room";

import Header from "@/components/chat/Header";
import InputArea from "@/components/chat/InputArea";
import MessagesContainer from "@/components/chat/MessagesContainer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Chat Room",
	description: "Engage in real-time conversations with AI or your friends.",
};

const fetchRoomDetails = async (roomId: string) => {
	if (!UUID_REGEX.test(roomId)) {
		notFound();
	}
	try {
		const details = await getRoomDetails(roomId);

		return details;
	} catch (error) {
		console.log("Error fetching room details:", error);
		if (error instanceof Error) {
			throw new Error(`Failed to fetch room details: ${error.message}`);
		} else {
			throw new Error("Failed to fetch room details");
		}
	}
};

export default async function ChatRoomPage({
	params,
}: {
	params: Promise<{ roomId: string }>;
}) {
	const { roomId } = await params;
	const roomDetails = await fetchRoomDetails(roomId);
	if (!roomDetails) notFound();

	return (
		<div className="h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:bg-linear-to-br dark:from-gray-950 dark:via-gray-900 dark:to-black transition-colors duration-300 flex flex-col overflow-hidden w-full">
			{/* Header */}
			<Header roomDetails={roomDetails} />

			{/* Messages Container */}
			<Suspense>
				<MessagesContainer details={roomDetails} />
			</Suspense>

			{/* Input Area  */}
			<InputArea details={roomDetails} />
		</div>
	);
}
