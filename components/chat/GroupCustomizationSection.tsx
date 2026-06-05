"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, FileText, ImagePlus, Users } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useUpdataeGroupAvatar, useUpdateGroupDetails } from "@/hooks/useRooms";
import Image from "next/image";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface GroupCustomizationSectionProps {
	roomId: string;
	avatar_url: string;
	description: string;
}

const GroupCustomizationSection = ({
	avatar_url,
	roomId,
	description,
}: GroupCustomizationSectionProps) => {
	const [roomDescription, setRoomDescription] = useState(description);
	const [isEditingDescription, setIsEditingDescription] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState<string | "">(
		avatar_url || "",
	);
	const avatarInputRef = useRef<HTMLInputElement>(null);

	const { mutateAsync: updateGroupDetails, isPending: isSavingDescription } =
		useUpdateGroupDetails();
	const { mutateAsync: updateUserAvatar, isPending: isUploadingAvatar } =
		useUpdataeGroupAvatar();

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isSavingDescription || isUploadingAvatar) return;
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

		const previwUrl = URL.createObjectURL(file);
		setAvatarPreview(previwUrl);

		await updateUserAvatar({
			avatarFile: file,
			roomId,
			oldAvatarUrl: avatar_url || "",
		});
	};

	const handleSaveDescription = async () => {
		if (isUploadingAvatar || isSavingDescription) return;
		if (!roomDescription.trim()) {
			toast.error("Description cannot be empty");
			return;
		}

		if (roomDescription.length > 500 || roomDescription.length < 5) {
			toast.error("Description must be between 5 and 500 characters");
			return;
		}

		await updateGroupDetails({
			roomId, // You need to pass the actual roomId here
			updates: { description: roomDescription },
		});
		setIsEditingDescription(false);
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

					<div>
						<Label className="text-gray-700 dark:text-gray-300 mb-3 block">
							Group Avatar
						</Label>
						<div className="flex items-center gap-4">
							<div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500 flex items-center justify-center shrink-0 overflow-hidden">
								{avatarPreview ? (
									<Image
										src={avatarPreview}
										alt="Preview"
										width={100}
										height={100}
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

					{/* Group Bio */}

					<div>
						<Label className="text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
							<FileText className="w-4 h-4" />
							Group Description
						</Label>
						{isEditingDescription ? (
							<div className="space-y-2">
								<Textarea
									value={roomDescription}
									onChange={(e) =>
										setRoomDescription(e.target.value.slice(0, 500))
									}
									placeholder="Write a bio for your group chat..."
									className="min-h-24 resize-none"
								/>
								<div className="flex items-center justify-between">
									<span className="text-xs text-gray-500 dark:text-gray-400">
										{roomDescription?.length}/500 characters
									</span>
									<div className="flex gap-2">
										<Button
											size="sm"
											onClick={handleSaveDescription}
											disabled={isSavingDescription}
										>
											{isSavingDescription ? "Saving..." : "Save"}
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												setIsEditingDescription(false);
												setRoomDescription("");
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
									{roomDescription || "No bio set yet"}
								</div>
								<Button
									variant="outline"
									onClick={() => setIsEditingDescription(true)}
									className="flex items-center gap-2"
								>
									<Edit3 className="w-4 h-4" />
									Edit Description
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default GroupCustomizationSection;
