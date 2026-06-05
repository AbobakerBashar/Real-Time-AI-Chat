import { AttachmentRenderer } from "../attachments/AttachmentRenderer";
import { AttachmentResponse } from "@/types/messages";

interface AttachmentsSectionProps {
	attachments: AttachmentResponse[];
	messageId: string;
	hasContent: boolean;
}

export const AttachmentsSection = ({
	attachments,
	messageId,
	hasContent,
}: AttachmentsSectionProps) => {
	if (!attachments || attachments.length === 0) return null;

	return (
		<div
			className={`mt-3 pt-3 border-current border-opacity-10 ${hasContent ? "border-t" : ""}`}
		>
			<div className="flex flex-col gap-3">
				{attachments.map((attachment, idx) => (
					<AttachmentRenderer
						key={`${messageId}-${idx}`}
						attachment={attachment}
						messageId={messageId}
						index={idx}
					/>
				))}
			</div>
		</div>
	);
};
