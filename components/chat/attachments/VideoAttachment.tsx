import { Eye } from "lucide-react";
import { FileIconInfo } from "../utils/attachmentUtils";
import { AttachmentResponse } from "@/types/messages";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import MediaPreviewModal from "../MediaPreviewModal";

interface VideoAttachmentProps {
	file: AttachmentResponse;
	fileIconInfo: FileIconInfo;
	isMediaType: (type: string, typeCategory: string) => boolean;
}

export const VideoAttachment = ({
	file,
	fileIconInfo,
	isMediaType,
}: VideoAttachmentProps) => {
	const [selectedVideo, setSelectedVideo] = useState<AttachmentResponse | null>(
		null,
	);
	const { Icon } = fileIconInfo;

	return (
		<div className="w-full bg-linear-to-br from-red-50 to-pink-50 dark:from-red-950/40 dark:to-pink-950/40 rounded-lg p-4 border-2 border-red-200 dark:border-red-800 shadow-md overflow-hidden">
			<div className="flex items-center gap-3 mb-3">
				<div
					className={`shrink-0 w-12 h-12 rounded-lg ${fileIconInfo.bgColor} flex items-center justify-center ${fileIconInfo.iconColor}`}
				>
					<Icon />
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase tracking-wide">
						Video File
					</p>
					<p className="text-sm font-medium truncate text-gray-700 dark:text-gray-300 mt-1">
						{file.name}
					</p>
				</div>
			</div>
			<video controls className="w-full max-w-xs rounded-lg bg-black/30 mb-2">
				<source src={file.url} />
				Your browser does not support the video element.
			</video>
			<Button
				onClick={() => setSelectedVideo(file)}
				variant="secondary"
				className="text-xs font-medium"
			>
				<Eye className="w-3 h-3" />
				View
			</Button>
			{selectedVideo &&
				createPortal(
					<MediaPreviewModal
						file={selectedVideo}
						onClose={() => setSelectedVideo(null)}
						isMediaType={isMediaType}
					/>,
					document.body,
				)}
		</div>
	);
};
