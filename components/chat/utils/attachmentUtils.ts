import {
	File,
	FileAudio,
	FileCode,
	FileText,
	FileVideo,
	Image as ImageIcon,
	type LucideIcon,
} from "lucide-react";

export interface FileIconInfo {
	Icon: LucideIcon;
	bgColor: string;
	iconColor: string;
}

export const getFileExtension = (fileName: string): string => {
	const match = fileName.match(/\.([^.]+)$/);
	return match ? match[1].toUpperCase() : "FILE";
};
export const getFileNameFromUrl = (url: string): string => {
	try {
		const pathname = new URL(url).pathname;
		const fileName = pathname.split("/").pop();

		return fileName || "attachment";
	} catch {
		// Fallback for invalid or relative URLs
		const urlWithoutParams = url.split("?")[0];
		const fileName = urlWithoutParams.split("/").pop();

		return fileName || "attachment";
	}
};

export const getFileTypeFromUrl = (
	type: string,
): "image" | "audio" | "video" | "document" | "other" => {
	const lowerType = type.toLowerCase();

	if (lowerType.startsWith("image/")) return "image";

	if (lowerType.startsWith("audio/")) return "audio";

	if (lowerType.startsWith("video/")) return "video";

	if (
		lowerType === "application/pdf" ||
		lowerType.startsWith("application/") ||
		lowerType.startsWith("text/") ||
		lowerType.includes("word") ||
		lowerType.includes("document") ||
		lowerType.includes("sheet") ||
		lowerType.includes("excel") ||
		lowerType.includes("presentation") ||
		lowerType.includes("powerpoint")
	) {
		return "document";
	}

	return "other";
};

export const getFileIcon = (type: string): FileIconInfo => {
	const mimeType = type.toLowerCase();

	if (mimeType.startsWith("image/")) {
		return {
			Icon: ImageIcon,
			bgColor: "bg-pink-100 dark:bg-pink-900/40",
			iconColor: "text-pink-600 dark:text-pink-400",
		};
	}

	if (mimeType.startsWith("video/")) {
		return {
			Icon: FileVideo,
			bgColor: "bg-red-100 dark:bg-red-900/40",
			iconColor: "text-red-600 dark:text-red-400",
		};
	}

	if (mimeType.startsWith("audio/")) {
		return {
			Icon: FileAudio,
			bgColor: "bg-green-100 dark:bg-green-900/40",
			iconColor: "text-green-600 dark:text-green-400",
		};
	}

	if (mimeType === "application/pdf") {
		return {
			Icon: FileText,
			bgColor: "bg-red-100 dark:bg-red-900/40",
			iconColor: "text-red-600 dark:text-red-400",
		};
	}

	if (
		mimeType.includes("word") ||
		mimeType.includes("document") ||
		mimeType ===
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	) {
		return {
			Icon: FileText,
			bgColor: "bg-blue-100 dark:bg-blue-900/40",
			iconColor: "text-blue-600 dark:text-blue-400",
		};
	}

	if (
		mimeType.includes("sheet") ||
		mimeType.includes("excel") ||
		mimeType ===
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	) {
		return {
			Icon: FileText,
			bgColor: "bg-green-100 dark:bg-green-900/40",
			iconColor: "text-green-600 dark:text-green-400",
		};
	}

	if (
		mimeType.includes("presentation") ||
		mimeType.includes("powerpoint") ||
		mimeType ===
			"application/vnd.openxmlformats-officedocument.presentationml.presentation"
	) {
		return {
			Icon: FileText,
			bgColor: "bg-orange-100 dark:bg-orange-900/40",
			iconColor: "text-orange-600 dark:text-orange-400",
		};
	}

	if (mimeType.startsWith("text/") || mimeType.includes("json")) {
		return {
			Icon: FileCode,
			bgColor: "bg-purple-100 dark:bg-purple-900/40",
			iconColor: "text-purple-600 dark:text-purple-400",
		};
	}

	return {
		Icon: File,
		bgColor: "bg-gray-100 dark:bg-gray-800",
		iconColor: "text-gray-600 dark:text-gray-400",
	};
};
