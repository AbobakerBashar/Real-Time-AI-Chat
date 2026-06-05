import { Download, Loader2 } from "lucide-react";
import { FileIconInfo } from "../utils/attachmentUtils";
import { AttachmentResponse } from "@/types/messages";
import { useState } from "react";
import { downloadFile } from "@/hooks/useMesssages";
import { toast } from "sonner";

interface AudioAttachmentProps {
	file: AttachmentResponse;
	fileIconInfo: FileIconInfo;
}

export const AudioAttachment = ({
	file,
	fileIconInfo,
}: AudioAttachmentProps) => {
	const [isDownloading, setIsDownloading] = useState(false);

	const { Icon } = fileIconInfo;
	const handleDownload = (url: string, fileName: string) => {
		try {
			setIsDownloading(true);
			downloadFile(url, fileName);
		} catch (error) {
			toast.error(
				"Failed to download file\n" +
					(error instanceof Error
						? error.message
						: "Failed to download file, Please try again later."),
			);
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<div className="w-full bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 rounded-lg p-4 border-2 border-green-200 dark:border-green-800 shadow-md">
			<div className="flex items-center gap-3 mb-3">
				<div
					className={`shrink-0 w-12 h-12 rounded-lg ${fileIconInfo.bgColor} flex items-center justify-center ${fileIconInfo.iconColor}`}
				>
					<Icon />
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">
						Audio File
					</p>
					<p className="text-sm font-medium truncate text-gray-700 dark:text-gray-300 mt-1">
						{file.name}
					</p>
				</div>
			</div>
			<audio controls className="w-full h-10 mb-2">
				<source src={file.url} />
				Your browser does not support the audio element.
			</audio>
			<button
				onClick={() => handleDownload(file.url, file.name)}
				disabled={isDownloading}
				className="inline-flex gap-2 text-xs font-medium px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors text-green-700 dark:text-green-300"
			>
				{isDownloading ? (
					<>
						<Loader2 className="w-4 h-4 animate-spin" />
						Downloading...
					</>
				) : (
					<>
						<Download className="w-4 h-4" />
						Download
					</>
				)}
			</button>
		</div>
	);
};
