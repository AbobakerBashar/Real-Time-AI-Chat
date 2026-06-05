import { Download, Music, X } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { formatFileSize } from "@/utils/send-message";
import { AttachmentResponse } from "@/types/messages";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import { downloadFile } from "@/hooks/useMesssages";
import GetFileIcon from "@/utils/medai";

type MediaPreviewModalProps = {
	file: AttachmentResponse;
	onClose: () => void;
	isMediaType: (type: string, mediaCategory: string) => boolean;
};

const MediaPreviewModal = ({
	file,
	onClose,
	isMediaType,
}: MediaPreviewModalProps) => {
	const [isDownloading, setIsDownloading] = useState(false);
	const [downloadError, setDownloadError] = useState<string | null>(null);
	const isImage = isMediaType(file.type, "image");
	const isVideo = isMediaType(file.type, "video");
	const isAudio = isMediaType(file.type, "audio");

	const handleDownload = (url: string, fileName: string) => {
		try {
			setDownloadError(null);
			setIsDownloading(true);
			downloadFile(url, fileName);
			setDownloadError(null);
		} catch (error) {
			setDownloadError(
				"Failed to download file\n" +
					(error instanceof Error
						? error.message
						: "Failed to download file, Please try again later."),
			);
		} finally {
			setIsDownloading(false);
		}
	};

	useEffect(() => {
		if (downloadError) {
			const timer = setTimeout(() => {
				setDownloadError(null);
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [downloadError]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			onClick={onClose}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className="bg-white dark:bg-gray-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				{downloadError && (
					<div className="flex items-center justify-between p-4 border-b border-red-500 bg-red-50">
						<p className="text-sm text-red-700">{downloadError}</p>
					</div>
				)}

				<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
					<div className="flex items-center gap-3 min-w-0">
						<GetFileIcon type={file.type} />
						<div className="min-w-0">
							<p className="font-semibold text-gray-900 dark:text-white truncate">
								{file.name}
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								{formatFileSize(file.size)} • {file.type}
							</p>
						</div>
					</div>
					<Button
						size="sm"
						variant="ghost"
						onClick={onClose}
						className="shrink-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
					>
						<X className="w-5 h-5" />
					</Button>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6">
					{isImage && file.url ? (
						<Image
							src={file.url}
							alt={file.name}
							width={800}
							height={600}
							className="max-w-full max-h-[70vh] object-contain rounded-lg"
						/>
					) : isVideo && file.url ? (
						<video
							controls
							className="max-w-full max-h-[70vh] rounded-lg bg-black"
							controlsList="nodownload"
						>
							<source src={file.url} type={file.type} />
							Your browser does not support video playback.
						</video>
					) : isAudio && file.url ? (
						<div className="flex flex-col items-center gap-6 w-full">
							<Music className="w-16 h-16 text-green-500 opacity-50" />
							<audio
								controls
								className="w-full max-w-md h-12 rounded-lg"
								controlsList="nodownload"
							>
								<source src={file.url} type={file.type} />
								Your browser does not support audio playback.
							</audio>
							<p className="text-sm text-gray-600 dark:text-gray-400 text-center">
								{file.name}
							</p>
						</div>
					) : (
						<div className="flex flex-col items-center gap-4">
							<GetFileIcon type={file.type} />
							<p className="text-gray-500 dark:text-gray-400 text-center">
								Preview not available for this file type
							</p>
							<p className="text-sm text-gray-400 dark:text-gray-500">
								{file.name}
							</p>
							<Button
								disabled={isDownloading}
								onClick={() => handleDownload(file.url, file.name)}
								className="mt-4"
							>
								<Download className="w-4 h-4 mr-2" />
								Download File
							</Button>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="border-t border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
					<p className="text-xs text-gray-500 dark:text-gray-400">
						Uploaded by <span className="font-medium">{file.uploadedBy}</span>
						{file.uploadedAt &&
							` on ${new Date(file.uploadedAt).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}`}
					</p>
					<Button
						onClick={() => handleDownload(file.url, file.name)}
						variant="outline"
						size="sm"
						className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/30"
					>
						<Download className="w-4 h-4 mr-2" />
						Download
					</Button>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default MediaPreviewModal;
