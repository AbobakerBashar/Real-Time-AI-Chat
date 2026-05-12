"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/useAuth";
import { useRecentRooms } from "@/hooks/useRooms";
import { motion } from "framer-motion";
import { Clock, MessageSquare, Settings, TrendingUp, User } from "lucide-react";
import Link from "next/link";

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4 },
	},
};

export default function DashboardrPage() {
	const { data: user, isLoading: userLoading } = useCurrentUser();
	const { data: recentRooms = [], isLoading: roomsLoading } = useRecentRooms(5);

	if (userLoading) {
		return (
			<div className="space-y-6">
				<div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
			</div>
		);
	}

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="space-y-8"
		>
			{/* Welcome Section */}
			<motion.div variants={itemVariants}>
				<div className="bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-600 dark:from-indigo-600 dark:via-purple-600 dark:to-indigo-700 rounded-xl p-8 text-white shadow-lg">
					<h1 className="text-3xl md:text-4xl font-bold mb-2">
						Welcome back, {user?.email?.split("@")[0]}!
					</h1>
					<p className="text-indigo-100 text-lg">
						Ready to chat? Pick up where you left off or start a new
						conversation.
					</p>
				</div>
			</motion.div>

			{/* Quick Stats */}
			<motion.div
				variants={itemVariants}
				className="grid grid-cols-1 md:grid-cols-3 gap-4"
			>
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
									Recent Chats
								</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">
									{recentRooms.length}
								</p>
							</div>
							<div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
								<MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
									Active Today
								</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">
									{recentRooms.length > 0 ? "Yes" : "No"}
								</p>
							</div>
							<div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
								<TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-start justify-between">
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
									Member Since
								</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">
									{user?.created_at
										? new Date(user.created_at).toLocaleDateString("en-US", {
												month: "short",
												year: "numeric",
											})
										: "N/A"}
								</p>
							</div>
							<div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
								<User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Recent Conversations */}
			<motion.div variants={itemVariants}>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						<Clock className="w-6 h-6" />
						Recent Conversations
					</h2>
					<Link href="/chat">
						<Button variant="outline" size="sm" className="hidden md:flex">
							View All
						</Button>
					</Link>
				</div>

				{roomsLoading ? (
					<div className="space-y-3">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
							/>
						))}
					</div>
				) : recentRooms.length > 0 ? (
					<div className="space-y-3">
						{recentRooms.map((room, index) => (
							<motion.div
								key={room.id}
								variants={itemVariants}
								custom={index}
								whileHover={{ scale: 1.02, x: 4 }}
								whileTap={{ scale: 0.98 }}
							>
								<Link href={`/chat/${room.id}`}>
									<Card className="hover:shadow-md dark:hover:shadow-purple-500/20 transition-all cursor-pointer">
										<CardContent className="pt-4">
											<div className="flex items-start gap-4">
												{/* Icon */}
												<div className="mt-1 shrink-0">
													{room.is_ai ? (
														<div className="w-3 h-3 bg-indigo-500 rounded-full" />
													) : (
														<div className="w-3 h-3 bg-green-500 rounded-full" />
													)}
												</div>

												{/* Content */}
												<div className="flex-1 min-w-0">
													<div className="flex items-baseline justify-between gap-2 mb-1">
														<h3 className="font-semibold text-gray-900 dark:text-white truncate">
															{room.name}
														</h3>
														<span
															className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap 
														shrink-0"
														>
															{room.last_message_at
																? new Date(
																		room.last_message_at,
																	).toLocaleDateString()
																: "N/A"}
														</span>
													</div>
													{room.last_message && (
														<p className="text-sm text-gray-600 dark:text-gray-400 truncate">
															{room.last_message}
														</p>
													)}
												</div>
											</div>
										</CardContent>
									</Card>
								</Link>
							</motion.div>
						))}
					</div>
				) : (
					<Card>
						<CardContent className="pt-6 text-center">
							<p className="text-gray-600 dark:text-gray-400 mb-4">
								No conversations yet. Start chatting to see your recent
								conversations here!
							</p>
							<Link href="/chat">
								<Button>Start a Conversation</Button>
							</Link>
						</CardContent>
					</Card>
				)}
			</motion.div>

			{/* Quick Actions */}
			<motion.div variants={itemVariants}>
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					Quick Actions
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Link href="/chat">
						<motion.div
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="h-full"
						>
							<Card className="h-full hover:shadow-md dark:hover:shadow-blue-500/20 transition-all cursor-pointer">
								<CardContent className="pt-6">
									<div className="flex items-start gap-4">
										<div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
											<MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
										</div>
										<div>
											<h3 className="font-semibold text-gray-900 dark:text-white">
												Start Chatting
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												Jump into a conversation
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</Link>

					<Link href="/dashboard/profile">
						<motion.div
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="h-full"
						>
							<Card className="h-full hover:shadow-md dark:hover:shadow-purple-500/20 transition-all cursor-pointer">
								<CardContent className="pt-6">
									<div className="flex items-start gap-4">
										<div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
											<Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
										</div>
										<div>
											<h3 className="font-semibold text-gray-900 dark:text-white">
												Manage Profile
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												Update your information
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</Link>
				</div>
			</motion.div>
		</motion.div>
	);
}
