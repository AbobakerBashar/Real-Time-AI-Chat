"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetRoomFiles } from "@/hooks/useMesssages";
import { Member } from "@/types/auth";
import { AttachmentResponse } from "@/types/messages";
import GetFileIcon from "@/utils/medai";
import { formatFileSize } from "@/utils/send-message";
import { motion } from "framer-motion";
import { Image as ImageIcon, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import MediaFilesStats from "./MediaFilesStats";
import MediaPreviewModal from "./MediaPreviewModal";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface MediaFilesSectionProps {
	isGroupChat: boolean;
	roomId: string;
	members: Member[];
}

const isMediaType = (type: string, typeCategory: string) => {
	return type.includes(typeCategory);
};

const MediaFilesSection = ({
	isGroupChat,
	roomId,
	members,
}: MediaFilesSectionProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [selectedFile, setSelectedFile] = useState<AttachmentResponse | null>(
		null,
	);
	const { data: mediaFiles, isLoading: isFetchingRoomFiles } =
		useGetRoomFiles(roomId);

	if (!isGroupChat) {
		return null;
	}

	if (isFetchingRoomFiles) {
		return (
			<Card className="pt-0">
				<CardHeader className="bg-linear-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 py-2 flex flex-row items-center justify-between">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						<ImageIcon className="w-6 h-6 text-orange-500" />
						Shared Media & Files
					</h2>
					<Button variant="outline" size="sm" disabled className="text-xs">
						Loading...
					</Button>
				</CardHeader>
				<CardContent className="pt-6">
					<p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
						Loading media files...
					</p>
				</CardContent>
			</Card>
		);
	}

	const hasFiles = mediaFiles && mediaFiles.length > 0;

	return (
		<motion.div
			variants={itemVariants}
			initial="hidden"
			animate="visible"
			transition={{ delay: 0.22 }}
			className="mb-6"
		>
			<Card className="pt-0">
				<CardHeader className="bg-linear-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 py-2 flex flex-row items-center justify-between">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						<ImageIcon className="w-6 h-6 text-orange-500" />
						Shared Media & Files
						{hasFiles && (
							<span className="text-sm font-normal ml-2 px-2 py-1 bg-orange-200 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full">
								{mediaFiles?.length}
							</span>
						)}
					</h2>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsExpanded(!isExpanded)}
						className="text-xs"
					>
						{isExpanded ? "Hide" : "Show"}
					</Button>
				</CardHeader>

				{isExpanded && (
					<CardContent className="pt-6">
						{!hasFiles ? (
							<p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
								No files shared yet
							</p>
						) : (
							<div className="space-y-2">
								{mediaFiles?.map((file) => {
									const sender = members.find((m) => m.id === file.uploadedBy);
									const senderName = sender
										? sender.full_name || sender.username || "Unknown"
										: "Unknown";
									const senderAvatar = sender
										? sender.avatar_url || undefined
										: undefined;

									return (
										<FileItem
											key={file.uploadedAt + file.name}
											file={file}
											onSelect={setSelectedFile}
											senderName={senderName}
											senderAvatar={senderAvatar}
										/>
									);
								})}
							</div>
						)}

						{hasFiles && (
							<MediaFilesStats
								mediaFiles={mediaFiles || []}
								isMediaType={isMediaType}
							/>
						)}
					</CardContent>
				)}

				{/* Media Preview Modal */}
				{selectedFile && (
					<MediaPreviewModal
						file={selectedFile}
						onClose={() => setSelectedFile(null)}
						isMediaType={isMediaType}
					/>
				)}
			</Card>
		</motion.div>
	);
};
export default MediaFilesSection;

const FileItem = ({
	file,
	onSelect,
	senderName,
	senderAvatar,
}: {
	file: AttachmentResponse;
	onSelect: (file: AttachmentResponse) => void;
	senderName?: string;
	senderAvatar?: string;
}) => {
	const isImage = isMediaType(file.type, "image");
	const isVideo = isMediaType(file.type, "video");
	const isAudio = isMediaType(file.type, "audio");

	return (
		<motion.div
			initial={{ opacity: 0, x: -10 }}
			animate={{ opacity: 1, x: 0 }}
			className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
			onClick={() => onSelect(file)}
		>
			{/* Thumbnail or Icon */}
			<div className="flex-1 flex items-center gap-3">
				<div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
					{isImage && file.url ? (
						<Image
							src={file.url}
							alt={file.name}
							height={56}
							width={56}
							className="w-full h-full object-cover"
						/>
					) : isVideo && file.url ? (
						<>
							<div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
							<div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors">
								<Play className="w-5 h-5 text-white" />
							</div>
						</>
					) : (
						<div className="flex items-center justify-center">
							<GetFileIcon type={file.type} />
						</div>
					)}
				</div>

				{/* File Info */}
				<div className="flex-1 min-w-0">
					<p className="font-medium text-gray-900 dark:text-white truncate text-sm">
						{file.name}
					</p>
					<div className="flex items-center gap-2 mt-1">
						<span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
							{formatFileSize(file.size)}
						</span>
						{isAudio && (
							<span className="text-xs text-green-600 dark:text-green-400 font-medium">
								● Audio
							</span>
						)}
						{isVideo && (
							<span className="text-xs text-red-600 dark:text-red-400 font-medium">
								● Video
							</span>
						)}
						{isImage && (
							<span className="text-xs text-pink-600 dark:text-pink-400 font-medium">
								● Image
							</span>
						)}
					</div>
				</div>
			</div>
			{/* Sender Info */}
			<div className="w-35 md:w-50 lg:w-60 overflow-hidden">
				<div className="flex items-center gap-2 mt-1">
					<Avatar>
						{senderAvatar && (
							<AvatarImage src={senderAvatar} alt={senderName} />
						)}
						<AvatarFallback>
							{senderName ? senderName.charAt(0) : "U"}
						</AvatarFallback>
					</Avatar>

					<span className="text-xs text-gray-500 dark:text-gray-400 columns-1 truncate">
						{senderName}
					</span>
				</div>

				<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
					{file.uploadedAt &&
						` on ${new Date(file.uploadedAt).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})}`}
				</p>
			</div>
		</motion.div>
	);
};
