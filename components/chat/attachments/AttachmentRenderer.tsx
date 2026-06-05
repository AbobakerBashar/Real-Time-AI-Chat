import { motion } from "framer-motion";
import {
	getFileExtension,
	getFileIcon,
	getFileNameFromUrl,
	getFileTypeFromUrl,
} from "../utils/attachmentUtils";
import { AudioAttachment } from "./AudioAttachment";
import { DocumentAttachment } from "./DocumentAttachment";
import { ImageAttachment } from "./ImageAttachment";
import { VideoAttachment } from "./VideoAttachment";
import { AttachmentResponse } from "@/types/messages";

const isMediaType = (type: string, typeCategory: string) => {
	return type.includes(typeCategory);
};

interface AttachmentRendererProps {
	attachment: AttachmentResponse;
	messageId: string;
	index: number;
}

export const AttachmentRenderer = ({
	attachment,
	messageId,
	index,
}: AttachmentRendererProps) => {
	const fileType = getFileTypeFromUrl(attachment?.type || "");
	const fileName = getFileNameFromUrl(attachment.url || "");
	const fileExtension = getFileExtension(fileName);
	const fileIconInfo = getFileIcon(attachment?.type || "");

	return (
		<motion.div
			key={`${messageId}-${index}`}
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			className="w-full"
		>
			{fileType === "image" && (
				<ImageAttachment file={attachment} isMediaType={isMediaType} />
			)}

			{fileType === "audio" && (
				<AudioAttachment file={attachment} fileIconInfo={fileIconInfo} />
			)}

			{fileType === "video" && (
				<VideoAttachment
					file={attachment}
					fileIconInfo={fileIconInfo}
					isMediaType={isMediaType}
				/>
			)}

			{(fileType === "document" || fileType === "other") && (
				<DocumentAttachment
					file={attachment}
					isMediaType={isMediaType}
					fileExtension={fileExtension}
					fileIconInfo={fileIconInfo}
				/>
			)}
		</motion.div>
	);
};
