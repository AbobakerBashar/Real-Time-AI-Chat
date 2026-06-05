import { AttachmentResponse } from "@/types/messages";
import GetFileIcon from "@/utils/medai";
import { formatFileSize } from "@/utils/send-message";

type MediaFilesStatsProps = {
	mediaFiles: AttachmentResponse[];
	isMediaType: (type: string, mediaCategory: string) => boolean;
};

const MediaFilesStats = ({ mediaFiles, isMediaType }: MediaFilesStatsProps) => {
	if (mediaFiles.length === 0) return null;

	const imageCount = mediaFiles.filter((f) =>
		isMediaType(f.type, "image"),
	).length;
	const videoCount = mediaFiles.filter((f) =>
		isMediaType(f.type, "video"),
	).length;
	const audioCount = mediaFiles.filter((f) =>
		isMediaType(f.type, "audio"),
	).length;
	const totalSize = mediaFiles.reduce((sum, f) => sum + f.size, 0);

	return (
		<div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
				<StatsItem label="Total Files" value={mediaFiles.length} />
				<StatsItem label="Total Size" value={formatFileSize(totalSize)} />
				{imageCount > 0 && (
					<StatsItem label="Images" value={imageCount}>
						<GetFileIcon type="image/" />
					</StatsItem>
				)}
				{videoCount > 0 && (
					<StatsItem label="Videos" value={videoCount}>
						<GetFileIcon type="video/" />
					</StatsItem>
				)}
				{audioCount > 0 && (
					<StatsItem label="Audio" value={audioCount}>
						<GetFileIcon type="audio/" />
					</StatsItem>
				)}
			</div>
		</div>
	);
};
export default MediaFilesStats;

const StatsItem = ({
	label,
	value,
	children,
}: {
	label: string;
	value: string | number;
	children?: React.ReactNode;
}) => {
	return (
		<div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 flex flex-col items-center gap-1">
			{children}
			<p className="text-2xl font-bold text-gray-900 dark:text-white">
				{value}
			</p>
			<p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
		</div>
	);
};
