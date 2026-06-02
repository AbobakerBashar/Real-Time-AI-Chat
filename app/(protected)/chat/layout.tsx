import Sidebar from "@/components/chat/Sidebar";
import SidebarRealtimeListener from "@/components/chat/SidebarRealtimeListener";
import { Suspense } from "react";

export const metadata = {
	title: "Chat",
	description: "Engage in real-time conversations with AI or your friends.",
};

export default function ChatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col md:flex-row">
			{/* Sidebar - Conversation List - Hidden on mobile */}
			<div className="hidden md:flex md:w-80 md:shrink-0">
				<Sidebar />
			</div>
			<Suspense>
				<SidebarRealtimeListener />
			</Suspense>
			<div className="flex-1">{children}</div>
		</div>
	);
}
