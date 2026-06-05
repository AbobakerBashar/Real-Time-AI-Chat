import { getRoomDetails } from "@/actions/room";
import DangerZone from "@/components/chat/DangerZone";
import GroupCustomizationSection from "@/components/chat/GroupCustomizationSection";
import ManageRoomHeader from "@/components/chat/ManageRoomHeader";
import MembersListSection from "@/components/chat/MembersListSection";
import MobileHeader from "@/components/chat/MobileHeader";
import RoomInformation from "@/components/chat/RoomInformation";

import { UUID_REGEX } from "@/utils/validate";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

const MediaFilesSection = dynamic(
	() => import("@/components/chat/MediaFilesSection"),
);

const fetchRoomDetails = async (roomId: string) => {
	if (!UUID_REGEX.test(roomId)) {
		notFound();
	}

	try {
		const details = await getRoomDetails(roomId);

		return details;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("Failed to fetch room details. Please try again later.");
		}
	}
};

export default async function ManageRoomPage({
	params,
}: {
	params: Promise<{ roomId: string }>;
}) {
	const { roomId } = await params;

	const roomDetails = await fetchRoomDetails(roomId);
	if (!roomDetails) {
		notFound();
	}

	const isGroupChat = roomDetails.type === "group";
	const isAI = roomDetails.type === "ai";
	const role = roomDetails.current_user?.role;

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:bg-linear-to-br dark:from-gray-950 dark:via-gray-900 dark:to-black transition-colors duration-300">
			<MobileHeader />
			<div className="max-w-3xl mx-auto p-4 sm:p-6">
				{/* Header */}
				<ManageRoomHeader
					isGroupChat={isGroupChat}
					role={role}
					roomId={roomId}
				/>

				{/* Room Information */}
				<RoomInformation
					roomId={roomId}
					roomDetails={roomDetails}
					role={role}
				/>

				{/* Shared Media & Files */}
				<MediaFilesSection
					isGroupChat={isGroupChat}
					roomId={roomId}
					members={roomDetails?.members || []}
				/>

				{/* Members List - Only for Groups */}
				{isGroupChat && (
					<MembersListSection
						currentUserRole={role}
						currentUserId={roomDetails?.current_user?.id}
						isGroupChat={isGroupChat}
						members={roomDetails?.members || []}
						roomId={roomId}
					/>
				)}
				{/* Group Customization Section - Only for Groups */}
				{isGroupChat && (role === "owner" || role === "admin") && (
					<GroupCustomizationSection
						avatar_url={roomDetails?.avatar_url || ""}
						roomId={roomId}
						description={roomDetails?.description || ""}
					/>
				)}

				{/* Danger Zone */}
				<DangerZone
					isOwner={role === "owner"}
					roomId={roomId}
					members={roomDetails?.members || []}
					currentUserId={roomDetails?.current_user?.id}
					isGroupChat={isGroupChat}
					isAI={isAI}
				/>
			</div>
		</div>
	);
}
