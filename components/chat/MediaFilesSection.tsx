"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Download, FileText, Image as ImageIcon, Play, X } from "lucide-react";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface MediaFile {
	id: string;
	name: string;
	type: "image" | "video" | "document" | "other";
	url: string;
	size: number;
	uploadedBy: string;
	uploadedAt: Date;
	thumbnail?: string;
}

interface MediaFilesSectionProps {
	isGroupChat?: boolean;
}

// Mock data
const MOCK_MEDIA_FILES: MediaFile[] = [
	{
		id: "media-1",
		name: "Team Photo.jpg",
		type: "image",
		url: "https://via.placeholder.com/200",
		size: 2.5,
		uploadedBy: "Alex Johnson",
		uploadedAt: new Date("2024-05-20"),
		thumbnail: "https://via.placeholder.com/100",
	},
	{
		id: "media-2",
		name: "Meeting Recording.mp4",
		type: "video",
		url: "#",
		size: 125.8,
		uploadedBy: "Sarah Williams",
		uploadedAt: new Date("2024-05-18"),
		thumbnail: "https://via.placeholder.com/100",
	},
	{
		id: "media-3",
		name: "Project Report.pdf",
		type: "document",
		url: "#",
		size: 3.2,
		uploadedBy: "Mike Chen",
		uploadedAt: new Date("2024-05-15"),
	},
	{
		id: "media-4",
		name: "Design Mockup.png",
		type: "image",
		url: "https://via.placeholder.com/200",
		size: 5.1,
		uploadedBy: "Emma Davis",
		uploadedAt: new Date("2024-05-10"),
		thumbnail: "https://via.placeholder.com/100",
	},
	{
		id: "media-5",
		name: "Budget Spreadsheet.xlsx",
		type: "document",
		url: "#",
		size: 0.8,
		uploadedBy: "Alex Johnson",
		uploadedAt: new Date("2024-05-08"),
	},
];

const MediaFilesSection = ({ isGroupChat }: MediaFilesSectionProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
	const [mediaFiles] = useState<MediaFile[]>(MOCK_MEDIA_FILES);

	const formatFileSize = (sizeInMB: number) => {
		if (sizeInMB > 1024) {
			return `${(sizeInMB / 1024).toFixed(2)} GB`;
		}
		return `${sizeInMB.toFixed(2)} MB`;
	};

	const getFileIcon = (type: string) => {
		switch (type) {
			case "image":
				return (
					<ImageIcon className="w-5 h-5 text-pink-500 dark:text-pink-400" />
				);
			case "video":
				return <Play className="w-5 h-5 text-red-500 dark:text-red-400" />;
			case "document":
				return (
					<FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />
				);
			default:
				return (
					<FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
				);
		}
	};

	if (!isGroupChat) {
		return null;
	}

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
						{mediaFiles.length === 0 ? (
							<p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
								No files shared yet
							</p>
						) : (
							<div className="space-y-3">
								{mediaFiles.map((file) => (
									<motion.div
										key={file.id}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
									>
										{/* Thumbnail or Icon */}
										{file.thumbnail ? (
											<div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
												<img
													src={file.thumbnail}
													alt={file.name}
													className="w-full h-full object-cover"
												/>
												{file.type === "video" && (
													<div className="absolute inset-0 flex items-center justify-center bg-black/40">
														<Play className="w-6 h-6 text-white" />
													</div>
												)}
											</div>
										) : (
											<div className="w-16 h-16 rounded-lg bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shrink-0">
												{getFileIcon(file.type)}
											</div>
										)}

										{/* File Info */}
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between gap-2">
												<div className="flex-1 min-w-0">
													<p className="font-medium text-gray-900 dark:text-white truncate">
														{file.name}
													</p>
													<div className="flex items-center gap-2 mt-1">
														<span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
															{formatFileSize(file.size)}
														</span>
														<span className="text-xs text-gray-500 dark:text-gray-400">
															{file.type.charAt(0).toUpperCase() +
																file.type.slice(1)}
														</span>
													</div>
												</div>
											</div>

											{/* File Metadata */}
											<div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
												Uploaded by{" "}
												<span className="font-medium text-gray-700 dark:text-gray-300">
													{file.uploadedBy}
												</span>{" "}
												on{" "}
												<span className="font-medium text-gray-700 dark:text-gray-300">
													{file.uploadedAt.toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric",
													})}
												</span>
											</div>
										</div>

										{/* Action Buttons */}
										<div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
											<Button
												size="sm"
												variant="ghost"
												onClick={() => setSelectedFile(file)}
												title="View/Preview"
												className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
											>
												<ImageIcon className="w-4 h-4" />
											</Button>
											<Button
												size="sm"
												variant="ghost"
												title="Download"
												className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/30"
											>
												<Download className="w-4 h-4" />
											</Button>
										</div>
									</motion.div>
								))}
							</div>
						)}

						{/* Stats */}
						{mediaFiles.length > 0 && (
							<div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
								<div className="grid grid-cols-3 gap-4 text-center">
									<div>
										<p className="text-2xl font-bold text-gray-900 dark:text-white">
											{mediaFiles.length}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											Total Files
										</p>
									</div>
									<div>
										<p className="text-2xl font-bold text-gray-900 dark:text-white">
											{formatFileSize(
												mediaFiles.reduce((sum, f) => sum + f.size, 0),
											)}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											Total Size
										</p>
									</div>
									<div>
										<p className="text-2xl font-bold text-gray-900 dark:text-white">
											{mediaFiles.filter((f) => f.type === "image").length}
										</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											Images
										</p>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				)}

				{/* Preview Modal */}
				{selectedFile && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
						>
							<div className="sticky top-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
								<p className="font-semibold text-gray-900 dark:text-white truncate">
									{selectedFile.name}
								</p>
								<Button
									size="sm"
									variant="ghost"
									onClick={() => setSelectedFile(null)}
									className="text-gray-600 dark:text-gray-400"
								>
									<X className="w-4 h-4" />
								</Button>
							</div>

							<div className="p-6 flex items-center justify-center">
								{selectedFile.thumbnail ? (
									<img
										src={selectedFile.thumbnail}
										alt={selectedFile.name}
										className="max-w-full max-h-[60vh] object-contain rounded-lg"
									/>
								) : (
									<div className="flex flex-col items-center gap-4">
										{getFileIcon(selectedFile.type)}
										<p className="text-gray-500 dark:text-gray-400">
											Preview not available
										</p>
										<Button className="mt-4">
											<Download className="w-4 h-4 mr-2" />
											Download File
										</Button>
									</div>
								)}
							</div>
						</motion.div>
					</div>
				)}
			</Card>
		</motion.div>
	);
};

export default MediaFilesSection;
