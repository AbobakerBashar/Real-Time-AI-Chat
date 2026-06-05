"use client";

import { useLeaveRoom, useDeleteRoom } from "@/hooks/useRooms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { TransferOwnershipModal } from "./TransferOwnershipModal";
import { useState } from "react";
import { Member } from "@/types/auth";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface DangerZoneProps {
	isOwner?: boolean;
	roomId: string;
	members: Member[];
	currentUserId?: string;
	isGroupChat: boolean;
	isAI: boolean;
}

const DangerZone = ({
	isOwner,
	roomId,
	members,
	currentUserId,
	isGroupChat,
	isAI,
}: DangerZoneProps) => {
	const { mutateAsync: leaveRoom, isPending: isLeaving } = useLeaveRoom();
	const { mutateAsync: deleteRoom, isPending: isDeleting } = useDeleteRoom();
	const [showTransferModal, setShowTransferModal] = useState(false);

	const handleDeleteRoom = async () => {
		if (!roomId || isDeleting) return;
		await deleteRoom({ roomId, chatType: isGroupChat ? "group" : "direct" });
	};

	const handleLeaveRoom = async () => {
		if (!roomId || isLeaving) return;
		console.log(
			"Leave Room clicked",
			isOwner && isGroupChat && members.length > 1,
		);
		// If owner and multiple members, show transfer modal
		if (isOwner && isGroupChat && members.length > 1) {
			setShowTransferModal(true);
			return;
		}

		// If not owner or single member group, just leave
		else if (!isGroupChat) await leaveRoom({ roomId, chatType: "direct" });
	};

	const handleTransferOwnership = async (newOwnerId: string) => {
		if (!roomId) return;
		await leaveRoom({ roomId, newOwnerId, chatType: "group" });
	};

	return (
		<>
			<motion.div
				variants={itemVariants}
				initial="hidden"
				animate="visible"
				transition={{ delay: 0.3 }}
			>
				<Card className="pt-0 border-red-200 dark:border-red-900/30">
					<CardHeader className="bg-red-50 dark:bg-red-950/20 py-2">
						<h2 className="text-2xl font-bold text-red-700 dark:text-red-400">
							Danger Zone
						</h2>
					</CardHeader>
					<CardContent className="pt-6 space-y-3">
						{(isAI || isOwner) && (
							<Button
								onClick={handleDeleteRoom}
								className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
							>
								{isDeleting ? (
									<>
										<Loader className="w-4 h-4 animate-spin" />
										<span>Deleting...</span>
									</>
								) : (
									<>
										<Trash2 className="w-4 h-4" />
										Delete Room
									</>
								)}
							</Button>
						)}
						{!isAI && (
							<Button
								onClick={handleLeaveRoom}
								variant="destructive"
								size="lg"
								disabled={isLeaving}
								className="w-full font-semibold"
							>
								{isLeaving ? (
									<>
										<Loader className="w-4 h-4 animate-spin" />
										<span>Leaving...</span>
									</>
								) : (
									"Leave Room"
								)}
							</Button>
						)}
					</CardContent>
				</Card>
			</motion.div>

			{showTransferModal && (
				<TransferOwnershipModal
					open={showTransferModal}
					onOpenChange={setShowTransferModal}
					members={members}
					currentUserId={currentUserId || ""}
					onTransfer={handleTransferOwnership}
					isTransferring={isLeaving}
				/>
			)}
		</>
	);
};

export default DangerZone;
