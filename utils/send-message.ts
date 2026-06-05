import { Attachment } from "@/types/messages";

export const getFileType = (file: File): Attachment["type"] => {
	if (file.type.startsWith("image/")) return "image";
	if (file.type.startsWith("audio/")) return "audio";
	if (
		file.type.includes("pdf") ||
		file.type.includes("document") ||
		file.type.includes("word")
	)
		return "document";
	return "other";
};

export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";

	const units = ["Bytes", "KB", "MB", "GB", "TB"];
	const k = 1024;

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
};
