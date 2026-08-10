import { getCurrentUserProfile } from "@/actions/userAction";
import ChatEmptyState from "@/components/chat/ChatEmptyState";
import MobileHeader from "@/components/chat/MobileHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Chat",
	description: "Chat with AI or your friends in real-time.",
};

const fetchProfile = async () => {
	try {
		const profile = await getCurrentUserProfile();
		return profile;
	} catch (error) {
		console.error("Error fetching profile:", error);
		return null;
	}
};

export default async function ChatPage() {
	const profile = await fetchProfile();
	const avatarUrl = profile?.avatar_url || "";
	const username = profile?.username || profile?.email || "User";

	return (
		<div className="h-screen bg-white dark:bg-gray-950 transition-colors duration-300 flex-1 flex flex-col overflow-hidden w-full bg-linear-to-br from-gray-50 via-white to-gray-100 dark:bg-linear-to-br dark:from-gray-950 dark:via-gray-900 dark:to-black">
			{/* Mobile Header */}
			<MobileHeader avatarUrl={avatarUrl} username={username} />

			{/* Empty State View */}
			<ChatEmptyState />
		</div>
	);
}
