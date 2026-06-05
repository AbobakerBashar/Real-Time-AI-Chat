import {
	FileCode,
	FileText,
	Image as ImageIcon,
	Music,
	Play,
} from "lucide-react";

const GetFileIcon = ({ type }: { type: string }) => {
	const mimeType = type.toLowerCase();

	if (mimeType.startsWith("image/")) {
		return <ImageIcon className="w-5 h-5 text-pink-500 dark:text-pink-400" />;
	}

	if (mimeType.startsWith("video/")) {
		return <Play className="w-5 h-5 text-red-500 dark:text-red-400" />;
	}

	if (mimeType.startsWith("audio/")) {
		return <Music className="w-5 h-5 text-green-500 dark:text-green-400" />;
	}
	if (mimeType.startsWith("text/") || mimeType.includes("json")) {
		return <FileCode className="w-6 h-6" />;
	}

	if (mimeType === "application/pdf") {
		return (
			<div className="flex items-center gap-0 text-red-500">
				<FileText />
				<span>PDF</span>
			</div>
		);
	}

	if (
		mimeType.includes("word") ||
		mimeType.includes("document") ||
		mimeType.includes("sheet") ||
		mimeType.includes("excel") ||
		mimeType.includes("presentation") ||
		mimeType.includes("powerpoint")
	) {
		return <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
	}

	return <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
};

export default GetFileIcon;
