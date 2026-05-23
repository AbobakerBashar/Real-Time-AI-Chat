"use client";

import {
	useGetRoomDetails,
	useGetRoomMembers,
	useAddUserToGroup,
} from "@/hooks/useRooms";
import { useCurrentUser } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
	Users,
	Edit3,
	Trash2,
	Plus,
	X,
	Shield,
	ArrowLeft,
	Copy,
	Check,
	ImagePlus,
	FileText,
} from "lucide-react";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ManageRoomPage() {
	const params = useParams();
	const router = useRouter();
	const roomId = params.roomId as string;

	const { data: user } = useCurrentUser();
	const { data: roomDetails, isLoading: isLoadingRoom } =
		useGetRoomDetails(roomId);
	const { data: members, isLoading: isLoadingMembers } =
		useGetRoomMembers(roomId);
	const { mutateAsync: addUserToGroup, isPending: isAddingMember } =
		useAddUserToGroup();

	const [isEditing, setIsEditing] = useState(false);
	const [roomName, setRoomName] = useState(roomDetails?.name || "");
	const [roomBio, setRoomBio] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [isEditingBio, setIsEditingBio] = useState(false);
	const [isSavingBio, setIsSavingBio] = useState(false);
	const [copied, setCopied] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
	const avatarInputRef = useRef<HTMLInputElement>(null);

	const isGroupChat = roomDetails?.type === "group";
	const isOwner = true; // You may need to track this in your data

	const handleCopyRoomId = () => {
		navigator.clipboard.writeText(roomId);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
		toast.success("Room ID copied!");
	};

	const handleSaveRoomName = async () => {
		if (!roomName.trim()) {
			toast.error("Room name cannot be empty");
			return;
		}

		setIsSaving(true);
		try {
			// Add API call to update room name here
			// await updateRoomName(roomId, roomName);
			toast.success("Room name updated successfully!");
			setIsEditing(false);
		} catch (error) {
			toast.error("Failed to update room name");
			console.error(error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeleteRoom = async () => {
		if (
			!confirm(
				"Are you sure you want to delete this room? This action cannot be undone.",
			)
		) {
			return;
		}

		try {
			// Add API call to delete room here
			// await deleteRoom(roomId);
			toast.success("Room deleted successfully!");
			router.push("/chat");
		} catch (error) {
			toast.error("Failed to delete room");
			console.error(error);
		}
	};

	const handleLeaveRoom = async () => {
		if (!confirm("Are you sure you want to leave this room?")) {
			return;
		}

		try {
			// Add API call to leave room here
			// await leaveRoom(roomId, user?.id);
			toast.success("You left the room");
			router.push("/chat");
		} catch (error) {
			toast.error("Failed to leave room");
			console.error(error);
		}
	};

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			toast.error("Please upload an image file");
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("File size must be less than 5MB");
			return;
		}

		const reader = new FileReader();
		reader.onload = async (event) => {
			const base64 = event.target?.result as string;
			setAvatarPreview(base64);

			setIsUploadingAvatar(true);
			try {
				// Add API call to upload avatar here
				// await updateRoomAvatar(roomId, file);
				toast.success("Avatar updated successfully!");
			} catch (error) {
				toast.error("Failed to update avatar");
				console.error(error);
				setAvatarPreview(null);
			} finally {
				setIsUploadingAvatar(false);
			}
		};
		reader.readAsDataURL(file);
	};

	const handleSaveBio = async () => {
		if (!roomBio.trim()) {
			toast.error("Bio cannot be empty");
			return;
		}

		if (roomBio.length > 500) {
			toast.error("Bio must be less than 500 characters");
			return;
		}

		setIsSavingBio(true);
		try {
			// Add API call to update bio here
			// await updateRoomBio(roomId, roomBio);
			toast.success("Bio updated successfully!");
			setIsEditingBio(false);
		} catch (error) {
			toast.error("Failed to update bio");
			console.error(error);
		} finally {
			setIsSavingBio(false);
		}
	};

	if (isLoadingRoom || isLoadingMembers) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-black p-4 sm:p-6">
				<div className="max-w-3xl mx-auto">
					<div className="animate-pulse space-y-4">
						<div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
						<div className="h-40 bg-gray-200 dark:bg-gray-800 rounded"></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-black transition-colors duration-300 p-4 sm:p-6">
			<div className="max-w-3xl mx-auto">
				{/* Header */}
				<motion.div
					variants={itemVariants}
					initial="hidden"
					animate="visible"
					className="mb-6"
				>
					<button
						onClick={() => router.back()}
						className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
						Back
					</button>
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
						Manage Room
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						{isGroupChat
							? "Manage group chat settings and members"
							: "Manage chat settings"}
					</p>
				</motion.div>

				{/* Room Information */}
				<motion.div
					variants={itemVariants}
					initial="hidden"
					animate="visible"
					transition={{ delay: 0.1 }}
					className="mb-6"
				>
					<Card>
						<CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900">
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
												Save
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
												{roomDetails?.name}
											</div>
											{isOwner && (
												<Button
													size="sm"
													variant="outline"
													onClick={() => setIsEditing(true)}
													className="flex items-center gap-2"
												>
													<Edit3 className="w-4 h-4" />
													Edit
												</Button>
											)}
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

				{/* Group Customization Section - Only for Groups */}
				{isGroupChat && (
					<motion.div
						variants={itemVariants}
						initial="hidden"
						animate="visible"
						transition={{ delay: 0.15 }}
						className="mb-6"
					>
						<Card>
							<CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
								<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
									<ImagePlus className="w-6 h-6 text-indigo-500" />
									Group Customization
								</h2>
							</CardHeader>
							<CardContent className="pt-6 space-y-6">
								{/* Group Avatar */}
								{isOwner && (
									<div>
										<Label className="text-gray-700 dark:text-gray-300 mb-3 block">
											Group Avatar
										</Label>
										<div className="flex items-center gap-4">
											<div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
												{avatarPreview ? (
													<img
														src={avatarPreview}
														alt="Preview"
														className="w-full h-full object-cover"
													/>
												) : (
													<Users className="w-10 h-10 text-white" />
												)}
											</div>
											<div className="flex-1">
												<input
													ref={avatarInputRef}
													type="file"
													accept="image/*"
													className="hidden"
													onChange={handleAvatarChange}
													disabled={isUploadingAvatar}
												/>
												<Button
													variant="outline"
													onClick={() => avatarInputRef.current?.click()}
													disabled={isUploadingAvatar}
													className="flex items-center gap-2"
												>
													<ImagePlus className="w-4 h-4" />
													{isUploadingAvatar ? "Uploading..." : "Upload Avatar"}
												</Button>
												<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
													PNG, JPG or GIF (Max 5MB)
												</p>
											</div>
										</div>
									</div>
								)}

								{/* Group Bio */}
								{isOwner && (
									<div>
										<Label className="text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
											<FileText className="w-4 h-4" />
											Group Bio
										</Label>
										{isEditingBio ? (
											<div className="space-y-2">
												<Textarea
													value={roomBio}
													onChange={(e) =>
														setRoomBio(e.target.value.slice(0, 500))
													}
													placeholder="Write a bio for your group chat..."
													className="min-h-24 resize-none"
												/>
												<div className="flex items-center justify-between">
													<span className="text-xs text-gray-500 dark:text-gray-400">
														{roomBio.length}/500 characters
													</span>
													<div className="flex gap-2">
														<Button
															size="sm"
															onClick={handleSaveBio}
															disabled={isSavingBio}
														>
															{isSavingBio ? "Saving..." : "Save"}
														</Button>
														<Button
															size="sm"
															variant="outline"
															onClick={() => {
																setIsEditingBio(false);
																setRoomBio("");
															}}
														>
															Cancel
														</Button>
													</div>
												</div>
											</div>
										) : (
											<div className="space-y-2">
												<div className="min-h-20 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
													{roomBio || "No bio set yet"}
												</div>
												<Button
													variant="outline"
													onClick={() => setIsEditingBio(true)}
													className="flex items-center gap-2"
												>
													<Edit3 className="w-4 h-4" />
													Edit Bio
												</Button>
											</div>
										)}
									</div>
								)}
							</CardContent>
						</Card>
					</motion.div>
				)}

				{/* Danger Zone */}
				<motion.div
					variants={itemVariants}
					initial="hidden"
					animate="visible"
					transition={{ delay: 0.3 }}
				>
					<Card className="border-red-200 dark:border-red-900/30">
						<CardHeader className="bg-red-50 dark:bg-red-950/20">
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
								variant="outline"
								className="w-full border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
							>
								Leave Room
							</Button>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
