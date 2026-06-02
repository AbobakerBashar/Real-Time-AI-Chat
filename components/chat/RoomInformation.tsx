"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Copy, Check, Edit3 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateGroupDetails } from "@/hooks/useRooms";
import { RoomDetails } from "@/types/rooms";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface RoomInformationProps {
	roomId: string;
	roomDetails: RoomDetails | null;
	role?: "admin" | "member" | "owner";
}

const RoomInformation = ({
	roomId,
	roomDetails,
	role,
}: RoomInformationProps) => {
	const [roomName, setRoomName] = useState(roomDetails?.name || "");
	const [isEditing, setIsEditing] = useState(false);
	const [copied, setCopied] = useState(false);

	const { mutateAsync: updateGroupDetails, isPending: isSaving } =
		useUpdateGroupDetails();

	const handleSaveRoomName = async () => {
		if (!roomName.trim()) {
			toast.error("Room name cannot be empty");
			return;
		}
		await updateGroupDetails({
			roomId,
			updates: { name: roomName },
		});
		setIsEditing(false);
	};

	const handleCopyRoomId = () => {
		navigator.clipboard.writeText(roomId);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
		toast.success("Room ID copied!");
	};

	return (
		<motion.div
			variants={itemVariants}
			initial="hidden"
			animate="visible"
			transition={{ delay: 0.1 }}
			className="mb-6"
		>
			<Card className="pt-0">
				<CardHeader className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 py-2">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						<Shield className="w-6 h-6 text-blue-500" />
						Room Information
					</h2>
				</CardHeader>
				<CardContent className="pt-6 space-y-4">
					{/* Room ID */}
					<div>
						<Label className="text-gray-700 dark:text-gray-300 mb-2 block">
							Room ID
						</Label>
						<div className="flex items-center gap-2">
							<div className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 font-mono truncate">
								{roomId}
							</div>
							<Button
								size="sm"
								variant="outline"
								onClick={handleCopyRoomId}
								className="flex items-center gap-2"
							>
								{copied ? (
									<Check className="w-4 h-4" />
								) : (
									<Copy className="w-4 h-4" />
								)}
								{copied ? "Copied" : "Copy"}
							</Button>
						</div>
					</div>

					{/* Room Name */}
					<div>
						<Label className="text-gray-700 dark:text-gray-300 mb-2 block">
							Room Name
						</Label>
						<div className="flex items-center gap-2">
							{isEditing ? (
								<>
									<Input
										value={roomName}
										onChange={(e) => setRoomName(e.target.value)}
										placeholder="Enter room name"
										className="flex-1"
									/>
									<Button
										size="sm"
										onClick={handleSaveRoomName}
										disabled={isSaving}
									>
										{isSaving ? "Saving..." : "Save"}
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={() => {
											setIsEditing(false);
											setRoomName(roomDetails?.name || "");
										}}
									>
										Cancel
									</Button>
								</>
							) : (
								<>
									<div className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">
										{roomName || "No name set yet"}
									</div>
									{role === "admin" ||
										(role === "owner" && (
											<Button
												size="sm"
												variant="outline"
												onClick={() => setIsEditing(true)}
												className="flex items-center gap-2"
											>
												<Edit3 className="w-4 h-4" />
												Edit
											</Button>
										))}
								</>
							)}
						</div>
					</div>

					{/* Room Type */}
					<div>
						<Label className="text-gray-700 dark:text-gray-300 mb-2 block">
							Room Type
						</Label>
						<div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white capitalize">
							{roomDetails?.type || "Unknown"}
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default RoomInformation;
