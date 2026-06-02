import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddMememberBtn from "@/components/chat/AddMemberBtn";
import { useCurrentUser } from "@/hooks/useAuth";
import { MinimalProfile } from "@/types/auth";
import { motion } from "framer-motion";
import { Plus, Users2 } from "lucide-react";
import Link from "next/link";
import { RoomDetails } from "@/types/rooms";

const ChatHeaderInfo = ({ details }: { details: RoomDetails | null }) => {
	const { data: currentUser, isLoading } = useCurrentUser();

	const type = details?.type;
	const groupName = type === "group" ? details?.name : "Group";
	const roomId = details?.id;

	const otherUser: MinimalProfile | undefined =
		type === "person" && !isLoading
			? details?.members?.find((m) => m.id !== currentUser?.id)
			: undefined;

	const isOnline = true;

	return (
		<div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
			<Link href={`/chat/${roomId}/manage`}>
				<motion.div
					whileHover={{ scale: 1.05 }}
					className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-linear-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 flex items-center justify-center select-none shrink-0"
				>
					{type !== "ai" ? (
						type === "person" ? (
							<Avatar>
								<AvatarFallback>
									{otherUser && otherUser.full_name
										? otherUser.full_name.charAt(0).toUpperCase()
										: "U"}
								</AvatarFallback>
								{otherUser?.avatar_url && (
									<AvatarImage src={otherUser.avatar_url} />
								)}
							</Avatar>
						) : (
							<div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-linear-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 flex items-center justify-center select-none shrink-0">
								<Users2 className="w-5 h-5" />
							</div>
						)
					) : (
						<span className="text-white font-bold text-lg">AI</span>
					)}
				</motion.div>
			</Link>
			<div className="flex-1 min-w-0">
				{isLoading ? (
					<div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1" />
				) : type !== "ai" ? (
					<>
						<div className="flex items-center gap-2">
							<h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
								{type !== "group"
									? otherUser?.username || otherUser?.full_name
									: groupName}
							</h1>
							{type === "group" && (details?.current_user?.role==="owner"||details?.current_user?.role==="admin") && (
								<AddMememberBtn
									roomId={roomId || ""}
									variant="outline"
									size="xs"
									className="shrink-0 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition-colors"
								>
									<Plus className="w-4 h-4" />
									<span className="hidden sm:inline text-xs font-medium ml-1">
										Add
									</span>
								</AddMememberBtn>
							)}
						</div>
						{type === "person" && (
							<p
								className={`text-xs sm:text-sm flex items-center gap-1 ${
									isOnline
										? "text-green-600 dark:text-green-400"
										: "text-gray-500 dark:text-gray-400"
								}`}
							>
								<span
									className={`w-2 h-2 rounded-full ${
										isOnline
											? "bg-green-600 dark:bg-green-400"
											: "bg-gray-500 dark:bg-gray-400"
									}`}
								/>
								{isOnline ? "Active now" : "Away"}
							</p>
						)}
						{type === "group" && (
							<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
								{details?.members?.length || 0} members
							</p>
						)}
					</>
				) : (
					<>
						<h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
							ChatAI Assistant
						</h1>
						<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
							Always available
						</p>
					</>
				)}
			</div>
		</div>
	);
};

export default ChatHeaderInfo;
