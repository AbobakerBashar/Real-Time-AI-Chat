"use client";

import { updateRoomLastMessage } from "@/actions/messagesActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendMessage } from "@/hooks/useMesssages";
import { Attachment } from "@/types/messages";
import { RoomDetails } from "@/types/rooms";
import { formatFileSize, getFileType } from "@/utils/send-message";
import { motion, AnimatePresence } from "framer-motion";
import {
	Loader,
	Plus,
	Send,
	X,
	File,
	Image as ImageIcon,
	FileText,
	Music,
} from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import { toast } from "sonner";

const inputAreaVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			delay: 0.2,
		},
	},
};

const getFileIcon = (type: Attachment["type"]) => {
	switch (type) {
		case "image":
			return <ImageIcon className="w-4 h-4" />;
		case "audio":
			return <Music className="w-4 h-4" />;
		case "document":
			return <FileText className="w-4 h-4" />;
		default:
			return <File className="w-4 h-4" />;
	}
};

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_ATTACHMENTS = 5;

const InputArea = ({ details }: { details: RoomDetails | null }) => {
	const [inputValue, setInputValue] = useState("");
	const [attachments, setAttachments] = useState<Attachment[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const roomId = details?.id || "";

	const { mutateAsync: sendMessage, isPending: isSendingMessage } =
		useSendMessage();

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.currentTarget.files;
		if (!files) return;

		if (attachments.length + files.length > MAX_ATTACHMENTS) {
			toast.error(`Maximum ${MAX_ATTACHMENTS} attachments allowed`);
			return;
		}

		const newAttachments: Attachment[] = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];

			if (file.size > MAX_FILE_SIZE) {
				toast.error(`${file.name} exceeds 25MB limit`);
				continue;
			}

			const attachment: Attachment = {
				file,
				id: `${Date.now()}-${i}`,
				type: getFileType(file),
			};

			if (file.type.startsWith("image/")) {
				const url = URL.createObjectURL(file);
				attachment.preview = url;
			}

			newAttachments.push(attachment);
		}

		setAttachments((prev) => [...prev, ...newAttachments]);

		// Reset input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const removeAttachment = (id: string) => {
		setAttachments((prev) => prev.filter((a) => a.id !== id));
	};

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isSendingMessage || !roomId) return;
		if (!inputValue.trim() && attachments.length === 0) return;

		const result = await sendMessage({
			data: {
				content: inputValue,
				roomId,
				isAI: details?.type === "ai",
			},
			attachments: attachments,
		});

		if (result.success) {
			setInputValue("");
			setAttachments([]);
			await updateRoomLastMessage(roomId, inputValue);

			for (const attachment of attachments) {
				if (attachment.preview) {
					URL.revokeObjectURL(attachment.preview);
				}
			}
		} else {
			console.error("Failed to send message:", result.error);
		}
	};

	return (
		<motion.div
			variants={inputAreaVariants}
			initial="hidden"
			animate="visible"
			className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300 shrink-0"
		>
			<div className="max-w-4xl mx-auto px-6 py-4">
				{/* Attachments Preview */}
				<AnimatePresence>
					{attachments.length > 0 && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-800"
						>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
								{attachments.map((attachment) => (
									<motion.div
										key={attachment.id}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										className="relative group"
									>
										<div className="w-full aspect-square rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center">
											{attachment.preview ? (
												<>
													<Image
														src={attachment.preview}
														alt={attachment.file.name || "Attachment"}
														width={200}
														height={200}
														className="w-full h-full object-cover"
													/>
													{console.log(attachment.preview)}
												</>
											) : (
												<div className="flex flex-col items-center justify-center gap-1 p-2 text-center">
													{getFileIcon(attachment.type)}
													<span className="text-xs text-gray-600 dark:text-gray-400 truncate">
														{attachment.file.name
															.split(".")
															.pop()
															?.toUpperCase()}
													</span>
													<span className="text-xs text-gray-500 dark:text-gray-500">
														{formatFileSize(attachment.file.size)}
													</span>
												</div>
											)}

											{/* Remove Button */}
											<motion.button
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.95 }}
												onClick={() => removeAttachment(attachment.id)}
												className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20"
											>
												<X className="w-3 h-3" />
											</motion.button>

											{/* Hover Overlay */}
											<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
										</div>

										{/* Filename Tooltip */}
										<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
											{attachment.file.name}
										</div>
									</motion.div>
								))}
							</div>

							{/* Attachment Summary */}
							<div className="mt-3 flex items-center justify-between text-sm">
								<span className="text-gray-600 dark:text-gray-400">
									{attachments.length} file{attachments.length !== 1 ? "s" : ""}{" "}
									attached
									{" • "}
									{formatFileSize(
										attachments.reduce((sum, a) => sum + a.file.size, 0),
									)}
								</span>
								{attachments.length < MAX_ATTACHMENTS && (
									<button
										onClick={() => fileInputRef.current?.click()}
										className="text-blue-600 dark:text-blue-400 hover:underline"
									>
										Add more
									</button>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Input Form */}
				<form onSubmit={handleSendMessage} className="flex gap-3">
					{/* Attachment Button */}
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						onClick={() => fileInputRef.current?.click()}
						title="Add attachment"
						disabled={isSendingMessage || attachments.length >= MAX_ATTACHMENTS}
					>
						<Plus className="w-5 h-5" />
					</Button>

					{/* Hidden File Input */}
					<input
						ref={fileInputRef}
						type="file"
						multiple
						onChange={handleFileSelect}
						className="hidden"
						accept="image/*,audio/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,video/*"
						disabled={attachments.length >= MAX_ATTACHMENTS}
					/>

					{/* Message Input */}
					<Input
						type="text"
						placeholder={
							attachments.length > 0
								? `Add a message with ${attachments.length} attachment(s)...`
								: "Type your message..."
						}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						disabled={isSendingMessage}
						className="flex-1 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
					/>

					{/* Send Button */}
					<Button
						type="submit"
						disabled={
							isSendingMessage ||
							(!inputValue.trim() && attachments.length === 0)
						}
						className="bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white px-6"
					>
						{isSendingMessage ? (
							<motion.div
								animate={{ rotate: 360 }}
								transition={{
									duration: 1,
									repeat: Infinity,
									ease: "linear",
								}}
							>
								<Loader className="w-4 h-4" />
							</motion.div>
						) : (
							<Send className="w-4 h-4" />
						)}
					</Button>
				</form>

				<p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
					✨ Powered by advanced AI • Your conversations are private & secure
				</p>
			</div>
		</motion.div>
	);
};

export default InputArea;
