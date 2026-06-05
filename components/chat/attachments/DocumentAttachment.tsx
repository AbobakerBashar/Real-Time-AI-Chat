import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileIconInfo } from "../utils/attachmentUtils";
import { AttachmentResponse } from "@/types/messages";
import { createPortal } from "react-dom";
import { useState } from "react";
import MediaPreviewModal from "../MediaPreviewModal";

interface DocumentAttachmentProps {
	file: AttachmentResponse;
	fileExtension: string;
	isMediaType: (type: string, typeCategory: string) => boolean;
	fileIconInfo: FileIconInfo;
}

export const DocumentAttachment = ({
	file,
	fileExtension,
	isMediaType,
	fileIconInfo,
}: DocumentAttachmentProps) => {
	const { Icon } = fileIconInfo;
	const [selectedVideo, setSelectedVideo] = useState<AttachmentResponse | null>(
		null,
	);

	return (
		<div className="flex items-center gap-3 w-full rounded-lg bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700/50 dark:hover:to-gray-800/50 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all p-4 group shadow-md hover:shadow-lg">
			<div
				className={`shrink-0 w-14 h-14 rounded-lg ${fileIconInfo.bgColor} flex items-center justify-center ${fileIconInfo.iconColor} shadow-md`}
			>
				<Icon />
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<span className="text-sm font-bold truncate text-gray-900 dark:text-gray-100 flex-1">
						{file.name}
					</span>
					<span className="text-xs font-bold px-2 py-1 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 shrink-0">
						{fileExtension}
					</span>
				</div>
				<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
					Click to open in new tab
				</p>
			</div>

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
