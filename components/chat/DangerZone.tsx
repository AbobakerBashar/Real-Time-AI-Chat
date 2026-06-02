"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLeaveRoom } from "@/hooks/useRooms";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const DangerZone = ({
	isOwner,
	roomId,
}: {
	isOwner?: boolean;
	roomId: string;
}) => {
	const { mutateAsync: leaveRoom, isPending: isLeaving } = useLeaveRoom();

	const handleDeleteRoom = async () => {};

	const handleLeaveRoom = async () => {
		if (!roomId || isLeaving) return;
		await leaveRoom({ roomId });
	};

	return (
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
					{isOwner && (
						<Button
							onClick={handleDeleteRoom}
							className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
						>
							<Trash2 className="w-4 h-4" />
							Delete Room
						</Button>
					)}
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
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default DangerZone;
