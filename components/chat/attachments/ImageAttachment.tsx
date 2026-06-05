import { AttachmentResponse } from "@/types/messages";
import Image from "next/image";
import { useState } from "react";
import MediaPreviewModal from "../MediaPreviewModal";
import { createPortal } from "react-dom";

interface ImageAttachmentProps {
	file: AttachmentResponse;
	isMediaType: (type: string, typeCategory: string) => boolean;
}

export const ImageAttachment = ({
	file,
	isMediaType,
}: ImageAttachmentProps) => {
	const [selectedImage, setSelectedImage] = useState<AttachmentResponse | null>(
		null,
	);

	return (
		<>
			<div className="relative group">
				<div className="relative w-full max-w-xs rounded-lg overflow-hidden border-2 border-pink-200 dark:border-pink-700 hover:border-pink-400 dark:hover:border-pink-500 transition-all shadow-md">
					<Image
						src={file.url}
						alt={file.name}
						width={300}
						height={300}
						className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
						onClick={() => setSelectedImage(file)}
					/>

					<span className="absolute top-2 left-2 bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded text-xs font-semibold text-gray-700 dark:text-gray-300">
						IMAGE
					</span>
				</div>{" "}
			</div>
			{selectedImage &&
				createPortal(
					<MediaPreviewModal
						file={selectedImage!}
						onClose={() => setSelectedImage(null)}
						isMediaType={isMediaType}
					/>,
					document.body,
				)}
		</>
	);
};
