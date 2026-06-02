"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, FileText, ImagePlus, Users } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useUpdateGroupDetails } from "@/hooks/useRooms";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const GroupCustomizationSection = ({
	role,
}: {
	role?: "owner" | "admin" | "member";
}) => {
	const [roomBio, setRoomBio] = useState("");
	const [isEditingBio, setIsEditingBio] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
	const avatarInputRef = useRef<HTMLInputElement>(null);

	const { mutateAsync: updateGroupDetails, isPending: isSavingBio } =
		useUpdateGroupDetails();

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

		if (roomBio.length < 500 && roomBio.length > 5) {
			toast.error("Bio must be between 5 and 500 characters");
			return;
		}

		await updateGroupDetails({
			roomId: "", // You need to pass the actual roomId here
			updates: { bio: roomBio },
		});
		setIsEditingBio(false);
	};

	return (
		<motion.div
			variants={itemVariants}
			initial="hidden"
			animate="visible"
			transition={{ delay: 0.15 }}
			className="mb-6"
		>
			<Card className="pt-0">
				<CardHeader className="bg-linear-to-r from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-2">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						<ImagePlus className="w-6 h-6 text-indigo-500" />
						Group Customization
					</h2>
				</CardHeader>
				<CardContent className="pt-6 space-y-6">
					{/* Group Avatar */}
					{role === "owner" ||
						(role === "admin" && (
							<div>
								<Label className="text-gray-700 dark:text-gray-300 mb-3 block">
									Group Avatar
								</Label>
								<div className="flex items-center gap-4">
									<div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500 flex items-center justify-center shrink-0 overflow-hidden">
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
						))}

					{/* Group Bio */}
					{role === "owner" ||
						(role === "admin" && (
							<div>
								<Label className="text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
									<FileText className="w-4 h-4" />
									Group Bio
								</Label>
								{isEditingBio ? (
									<div className="space-y-2">
										<Textarea
											value={roomBio}
											onChange={(e) => setRoomBio(e.target.value.slice(0, 500))}
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
						))}
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default GroupCustomizationSection;
