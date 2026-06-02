"use client";
import { useCurrentUser } from "@/hooks/useAuth";
import { useMessageRealtime } from "@/hooks/useMessageRealtime ";
import { useGetMessages } from "@/hooks/useMesssages";
import { formatTime } from "@/utils/formatTime";
import { AnimatePresence, motion } from "framer-motion";
import {
	Loader,
	Send,
	MessageCircle,
	Sparkles,
	Trash2,
	Pen,
	Download,
	File,
	Image as ImageIcon,
	FileText,
	Music,
	Video,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { MinimalProfile } from "@/types/auth";
import Image from "next/image";
import { RoomDetails } from "@/types/rooms";

const messageVariants = {
	hidden: { opacity: 0, y: 20, scale: 0.8 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.3,
		},
	},
	exit: { opacity: 0, y: -10 },
};

const getFileTypeFromUrl = (
	url: string,
): "image" | "audio" | "video" | "document" | "other" => {
	const extension = url.split(".").pop()?.toLowerCase() || "";
	const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
	const audioExtensions = ["mp3", "wav", "ogg", "m4a", "flac", "aac"];
	const videoExtensions = [
		"mp4",
		"webm",
		"mov",
		"avi",
		"mkv",
		"flv",
		"wmv",
		"m4v",
	];
	const documentExtensions = [
		"pdf",
		"doc",
		"docx",
		"txt",
		"xlsx",
		"xls",
		"ppt",
		"pptx",
	];

	if (imageExtensions.includes(extension)) return "image";
	if (audioExtensions.includes(extension)) return "audio";
	if (videoExtensions.includes(extension)) return "video";
	if (documentExtensions.includes(extension)) return "document";
	return "other";
};

const getFileIcon = (
	type: "image" | "audio" | "video" | "document" | "other",
) => {
	switch (type) {
		case "image":
			return <ImageIcon className="w-4 h-4" />;
		case "audio":
			return <Music className="w-4 h-4" />;
		case "video":
			return <Video className="w-4 h-4" />;
		case "document":
			return <FileText className="w-4 h-4" />;
		default:
			return <File className="w-4 h-4" />;
	}
};

const getFileNameFromUrl = (url: string): string => {
	try {
		// Remove query parameters
		const urlWithoutParams = url.split("?")[0];
		// Get the last part of the URL path
		const parts = urlWithoutParams.split("/");
		return parts[parts.length - 1] || "attachment";
	} catch {
		return "attachment";
	}
};

const MessagesContainer = ({ details }: { details: RoomDetails | null }) => {
	const roomId = details?.id || "";
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { data: messages, isLoading } = useGetMessages(roomId);
	const { data: currentUser } = useCurrentUser();
	const members: MinimalProfile[] = details?.members || [];

	// Set up real-time updates for messages in this room
	useMessageRealtime(roomId);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const isSentMessage = (senderId: string | null) => {
		return senderId === currentUser?.id;
	};

	return (
		<div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4 flex flex-col">
			<div className="max-w-4xl w-full mx-auto flex-1 flex flex-col space-y-3 sm:space-y-4">
				<AnimatePresence>
					{!isLoading &&
						messages &&
						messages.map((message) => {
							const isSent = isSentMessage(message.sender_id);
							const isAIMessage = message.is_ai;

							return (
								<motion.div
									key={message.id}
									variants={messageVariants}
									initial="hidden"
									animate="visible"
									exit="exit"
									className={`flex ${isSent ? "justify-end" : "justify-start"} gap-2 items-end`}
								>
									{/* Left side icon for received messages */}
									{!isSent && (
										<motion.div
											whileHover={{ scale: 1.1 }}
											className="shrink-0 flex items-center justify-center"
										>
											{isAIMessage ? (
												<div className="w-8 h-8 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
													<Sparkles className="w-4 h-4" />
												</div>
											) : (
												<div className="w-8 h-8 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
													<MessageCircle className="w-4 h-4" />
												</div>
											)}
										</motion.div>
									)}

									{/* Message bubble */}
									<motion.div
										whileHover={{ scale: 1.02 }}
										className={`rounded-lg shadow-sm transition-all min-w-70 ${
											message.attachments && message.attachments.length > 0
												? // Styles for messages with attachments
													isSent
													? "max-w-lg md:max-w-2xl px-4 py-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-br-none"
													: isAIMessage
														? "max-w-lg md:max-w-2xl px-4 py-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-bl-none"
														: "max-w-lg md:max-w-2xl px-4 py-3 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-bl-none"
												: // Styles for text-only messages
													isSent
													? "max-w-sm sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-600 dark:to-purple-600 text-white rounded-br-none shadow-indigo-500/20"
													: isAIMessage
														? "max-w-sm sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-gray-900 dark:text-white rounded-bl-none border border-purple-200 dark:border-purple-700"
														: "max-w-sm sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 bg-linear-to-r from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 text-gray-900 dark:text-white rounded-bl-none border border-cyan-200 dark:border-cyan-700"
										} ${
											message.attachments && message.attachments.length > 0
												? isSent
													? "text-gray-900 dark:text-white"
													: "text-gray-900 dark:text-gray-100"
												: ""
										}`}
									>
										{/* Badge and sender info */}
										<div className="flex items-center gap-2 mb-2">
											{isSent ? (
												<Badge
													variant="secondary"
													className={`text-xs ${
														message.attachments &&
														message.attachments.length > 0
															? "bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200"
															: "bg-indigo-200/50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200"
													}`}
												>
													<Send className="w-3 h-3 mr-1" />
													You
												</Badge>
											) : isAIMessage ? (
												<Badge
													variant="secondary"
													className={`text-xs ${
														message.attachments &&
														message.attachments.length > 0
															? "bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-200"
															: "bg-purple-200/50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-200"
													}`}
												>
													<Sparkles className="w-3 h-3 mr-1" />
													AI Assistant
												</Badge>
											) : (
												<Badge
													variant="secondary"
													className={`text-xs ${
														message.attachments &&
														message.attachments.length > 0
															? "bg-cyan-200 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200"
															: "bg-cyan-200/50 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-200"
													}`}
												>
													<MessageCircle className="w-3 h-3 mr-1" />
													{(members &&
														members.find((m) => m.id === message.sender_id)
															?.username) ||
														"User"}
												</Badge>
											)}
										</div>

										{/* Message content */}
										<p className="text-sm md:text-base wrap-break-word">
											{message.content}
										</p>

										{/* Attachments Display */}
										{message.attachments && message.attachments.length > 0 && (
											<div
												className={`mt-3 pt-3 border-current border-opacity-10 ${message.content ? "border-t" : ""}`}
											>
												<div className="flex flex-col gap-3">
													{message.attachments.map((attachmentUrl, idx) => {
														const fileType = getFileTypeFromUrl(attachmentUrl);
														const fileName = getFileNameFromUrl(attachmentUrl);

														return (
															<motion.div
																key={`${message.id}-${idx}`}
																initial={{ opacity: 0, scale: 0.8 }}
																animate={{ opacity: 1, scale: 1 }}
																className="w-full"
															>
																{fileType === "image" ? (
																	// Image Display
																	<div className="relative group">
																		<div className="relative w-full max-w-xs rounded-lg overflow-hidden border border-current border-opacity-20 hover:border-opacity-40 transition-all">
																			<Image
																				src={attachmentUrl}
																				alt={fileName}
																				width={300}
																				height={300}
																				className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
																			/>
																			<a
																				href={attachmentUrl}
																				target="_blank"
																				rel="noopener noreferrer"
																				className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
																			>
																				<Download className="w-4 h-4 text-white" />
																			</a>
																		</div>
																	</div>
																) : fileType === "audio" ? (
																	// Audio Player
																	<div className="w-full bg-current bg-opacity-5 rounded-lg p-3 border border-current border-opacity-20 hover:border-opacity-40 transition-all">
																		<div className="flex items-center gap-2 mb-2">
																			<Music className="w-4 h-4 shrink-0" />
																			<span className="text-xs truncate flex-1">
																				{fileName}
																			</span>
																		</div>
																		<audio
																			controls
																			className="w-full h-8"
																			controlsList="nodownload"
																		>
																			<source src={attachmentUrl} />
																			Your browser does not support the audio
																			element.
																		</audio>
																		<a
																			href={attachmentUrl}
																			download
																			className="mt-2 inline-flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity"
																		>
																			<Download className="w-3 h-3" />
																			Download
																		</a>
																	</div>
																) : fileType === "video" ? (
																	// Video Player
																	<div className="w-full bg-current bg-opacity-5 rounded-lg p-3 border border-current border-opacity-20 hover:border-opacity-40 transition-all">
																		<div className="flex items-center gap-2 mb-2">
																			<Video className="w-4 h-4 shrink-0" />
																			<span className="text-xs truncate flex-1">
																				{fileName}
																			</span>
																		</div>
																		<video
																			controls
																			className="w-full max-w-xs rounded bg-black/20"
																			controlsList="nodownload"
																		>
																			<source src={attachmentUrl} />
																			Your browser does not support the video
																			element.
																		</video>
																		<a
																			href={attachmentUrl}
																			download
																			className="mt-2 inline-flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity"
																		>
																			<Download className="w-3 h-3" />
																			Download
																		</a>
																	</div>
																) : (
																	// Document/Other File
																	<a
																		href={attachmentUrl}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="flex flex-col items-start w-full rounded-lg bg-current bg-opacity-5 hover:bg-opacity-10 border border-current border-opacity-20 hover:border-opacity-40 transition-all p-3 group cursor-pointer"
																	>
																		<div className="flex items-center gap-2 w-full">
																			<div className="flex items-center justify-center w-8 h-8 rounded-full bg-current bg-opacity-10 shrink-0 group-hover:bg-opacity-20 transition-colors">
																				{getFileIcon(fileType)}
																			</div>
																			<span className="text-xs truncate flex-1">
																				{fileName}
																			</span>
																			<Download className="w-3 h-3 opacity-0 group-hover:opacity-100" />
																		</div>
																	</a>
																)}
															</motion.div>
														);
													})}
												</div>
											</div>
										)}

										{/* Timestamp */}
										<div className="mt-2 flex items-center gap-5 justify-between">
											<p
												className={`text-xs opacity-70 ${
													message.attachments && message.attachments.length > 0
														? isSent
															? "text-indigo-600 dark:text-indigo-400"
															: isAIMessage
																? "text-purple-600 dark:text-purple-400"
																: "text-cyan-600 dark:text-cyan-400"
														: isSent
															? "text-indigo-100"
															: isAIMessage
																? "text-purple-700 dark:text-purple-300"
																: "text-cyan-700 dark:text-cyan-300"
												}`}
											>
												{formatTime(message.created_at || "")}
											</p>
											{isSent && (
												<div className="flex items-center gap-0">
													<Button
														size="sm"
														className="w-6 h-6 p-0 text-indigo-600 hover:text-indigo-700 bg-transparent"
													>
														<Pen className="w-3 h-3" />
													</Button>
													<Button
														size="sm"
														className="w-6 h-6 p-0 bg-transparent text-destructive hover:text-red-600"
													>
														<Trash2 className="w-full h-full" />
													</Button>
												</div>
											)}
										</div>
									</motion.div>

									{/* Right side icon for sent messages */}
									{isSent && (
										<motion.div
											whileHover={{ scale: 1.1 }}
											className="shrink-0 flex items-center justify-center"
										>
											<div className="w-8 h-8 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white">
												<Send className="w-4 h-4" />
											</div>
										</motion.div>
									)}
								</motion.div>
							);
						})}
				</AnimatePresence>

				{isLoading && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="flex justify-start gap-2 items-end"
					>
						<div className="w-8 h-8 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
							<Sparkles className="w-4 h-4" />
						</div>
						<div className="bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2 border border-purple-200 dark:border-purple-700">
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
							>
								<Loader className="w-4 h-4 text-purple-600 dark:text-purple-400" />
							</motion.div>
							<span className="text-sm text-purple-700 dark:text-purple-300">
								Loading messages...
							</span>
						</div>
					</motion.div>
				)}

				<div ref={messagesEndRef} />
			</div>
		</div>
	);
};

export default MessagesContainer;
