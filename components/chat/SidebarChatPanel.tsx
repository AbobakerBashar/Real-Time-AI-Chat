"use client";

import { useUsersWithoutRoom } from "@/hooks/useAuth";
import { useRecentRooms } from "@/hooks/useRooms";
import { Clock } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { lazy, useMemo } from "react";
import Conversations from "./Conversations";

const NewChat = lazy(() => import("./NewChat"));

const SidebarChatPanel = () => {
	const { data: recentRooms = [], isLoading: isLoadingRooms } =
		useRecentRooms(10);
	const { data: users, isLoading: isLoadingUsers } = useUsersWithoutRoom();

	const searchParamas = useSearchParams();
	const searchQuery = searchParamas.get("search") || "";
	const type = searchParamas.get("type") || "recent";

	const newChat = searchParamas.get("new") === "true";
	const filterType = ["person", "group", "recent", "ai"].includes(type)
		? (type as "person" | "group" | "recent" | "ai")
		: "recent";

	// Filter rooms by type
	const filteredRooms = useMemo(() => {
		if (!searchQuery.trim() && filterType === "recent") return recentRooms;

		if (searchQuery.trim()) {
			return recentRooms.filter((room) =>
				room.name?.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		} else if (filterType === "person") {
			return recentRooms.filter((room) => room.chat_type === "person");
		} else if (filterType === "group") {
			return recentRooms.filter((room) => room.chat_type === "group");
		} else if (filterType === "ai") {
			return recentRooms.filter((room) => room.chat_type === "ai");
		} else return recentRooms;
	}, [recentRooms, filterType, searchQuery]);

	return (
		<div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
			<div className="text-xs text-gray-600 dark:text-gray-500 font-semibold uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
				<Clock className="w-3.5 h-3.5" />
				Recent
			</div>
			{!newChat ? (
				isLoadingRooms ? (
					<div className="space-y-2">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-12 bg-gray-200 dark:bg-gray-800/50 rounded-lg animate-pulse"
							/>
						))}
					</div>
				) : filteredRooms.length > 0 ? (
					<Conversations rooms={filteredRooms} />
				) : (
					<p className="text-sm text-gray-500 dark:text-gray-400 px-2">
						{searchQuery
							? "No conversations found"
							: "No conversations yet. Start a new chat!"}
					</p>
				)
			) : isLoadingUsers ? (
				<div className="space-y-2">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="h-12 bg-gray-200 dark:bg-gray-800/50 rounded-lg animate-pulse"
						/>
					))}
				</div>
			) : (
				<NewChat users={users} />
			)}
		</div>
	);
};

export default SidebarChatPanel;
