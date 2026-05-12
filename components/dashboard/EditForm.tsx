"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateUserAvatar, useUpdateUserProfile } from "@/hooks/useAuth";
import { UserProfile } from "@/types/auth";
import {
	Cloud,
	Edit3,
	Loader,
	Loader2,
	Mail,
	Save,
	User as UserIcon,
	X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CardContent } from "../ui/card";
import ViewMode from "./ViewMode";

const EditForm = ({ profile }: { profile: UserProfile | null }) => {
	const [avatarPreview, setAvatarPreview] = useState<string | null>(
		profile?.avatar_url || null,
	);
	const [isEditing, setIsEditing] = useState(false);
	const [editForm, setEditForm] = useState({
		full_name: profile?.full_name || "",
		username: profile?.username || "",
	});

	const { mutateAsync: updateUserProfile, isPending: isUpdating } =
		useUpdateUserProfile();
	const { mutateAsync: updateAvatar, isPending: isUploadingAvatar } =
		useUpdateUserAvatar();

	const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsEditing(false);
		setEditForm({
			full_name: "",
			username: "",
		});
		setAvatarPreview(null);
	};

	const handleAvatarChange = async (file: File | null) => {
		if (!file || file.size === 0) return;

		// Validate file
		if (!file.type.startsWith("image/")) {
			toast.error("Please select a valid image file");
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image size must be less than 5MB");
			return;
		}

		// Create preview
		const url = URL.createObjectURL(file);
		setAvatarPreview(url);
		await updateAvatar({
			image_file: file,
			old_image_url: profile?.avatar_url || "",
		});

		URL.revokeObjectURL(url);
	};

	const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const result = await updateUserProfile(editForm);
		console.log("Profile update result:", result);

		setIsEditing(false);
		setAvatarPreview(null);
	};

	return (
		<CardContent className="space-y-6 relative">
			{!isEditing ? (
				<Button
					onClick={() => setIsEditing(true)}
					variant="outline"
					size="sm"
					className=" absolute right-2 -top-20 z-10"
				>
					<Edit3 className="size-4 mr-2" />
					Edit
				</Button>
			) : null}
			{isEditing && (
				<>
					{/* Avatar Upload Section */}
					<div className="space-y-3">
						<Label className="text-base font-semibold">Profile Picture</Label>
						<div className="relative">
							{/* Upload Area */}
							<label className="group relative block cursor-pointer">
								<input
									id="avatar"
									type="file"
									accept="image/*"
									onChange={(e) =>
										handleAvatarChange(e.target.files?.[0] || null)
									}
									disabled={isUploadingAvatar || isUpdating}
									className="hidden"
								/>
								<div className="flex items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-border bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-8 transition-all duration-300 group-hover:border-primary dark:group-hover:from-blue-900/30 dark:group-hover:to-purple-900/30">
									{/* Avatar Preview */}
									<div className="relative">
										<Avatar className="size-32 ring-4 ring-white dark:ring-gray-800 shadow-lg">
											<AvatarImage
												src={avatarPreview || profile?.avatar_url || ""}
												alt={profile?.full_name || "User"}
											/>
											<AvatarFallback className="text-2xl font-bold">
												{profile?.full_name
													? `${profile.full_name[0]}${profile.full_name.split(" ")[1]?.[0] || ""}`
													: "U"}
											</AvatarFallback>
										</Avatar>
										{isUploadingAvatar && (
											<div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
												<Loader2 className="size-8 animate-spin text-white" />
											</div>
										)}
									</div>

									{/* Upload Instructions */}
									<div className="flex-1 text-center">
										<Cloud className="mx-auto mb-3 size-8 text-primary opacity-60" />
										<p className="text-sm font-semibold text-foreground">
											Choose your avatar
										</p>
										<p className="mt-1 text-xs text-muted-foreground">
											or drag and drop
										</p>
										<p className="mt-3 text-xs text-muted-foreground">
											JPG, PNG or GIF • Max 5MB
										</p>
									</div>
								</div>
							</label>

							{/* Upload Status */}
							{isUploadingAvatar && (
								<div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
									<Loader2 className="size-4 animate-spin" />
									<span>Uploading your image...</span>
								</div>
							)}
						</div>
					</div>
					{/* Divider */}
					<div className="h-px bg-border" />
					<form onSubmit={handleSave} className="space-y-6">
						{/* Full Name */}
						<div className="space-y-3">
							<Label htmlFor="full-name" className="text-base font-semibold">
								<UserIcon className="inline mr-0.5 size-4" />
								Full Name
							</Label>
							<Input
								id="full-name"
								value={editForm.full_name}
								onChange={(e) =>
									setEditForm({
										...editForm,
										full_name: e.target.value,
									})
								}
								placeholder="Enter your full name"
								disabled={isUpdating}
								className="h-11 rounded-lg"
							/>
						</div>

						{/* Username */}
						<div className="space-y-3">
							<Label htmlFor="username" className="text-base font-semibold">
								<UserIcon className="inline mr-0.5 size-4" />
								Username
							</Label>
							<div className="flex items-center gap-0 rounded-lg border border-input bg-background">
								<Input
									id="username"
									value={editForm.username}
									onChange={(e) =>
										setEditForm({
											...editForm,
											username: e.target.value,
										})
									}
									placeholder="username"
									disabled={isUpdating}
									className="h-11 border-0 rounded-r-lg"
								/>
							</div>
						</div>

						{/* Email (Read-only) */}
						<div className="space-y-3">
							<Label htmlFor="email" className="text-base font-semibold">
								<Mail className="inline mr-0.5 size-4" />
								Email
							</Label>
							<Input
								id="email"
								value={profile?.email || ""}
								disabled
								className="h-11 rounded-lg bg-muted opacity-60"
							/>
							<p className="text-xs text-muted-foreground">
								Email address cannot be changed
							</p>
						</div>

						{/* Divider */}
						<div className="h-px bg-border" />

						{/* Action Buttons */}
						<div className="flex gap-3 pt-2">
							<Button
								className="flex-1 h-11 rounded-lg font-semibold"
								disabled={isUpdating}
								type="submit"
							>
								{isUpdating ? (
									<>
										<Loader className="w-4 h-4 animate-spin mr-2" />
										Saving...
									</>
								) : (
									<>
										<Save className="size-4 mr-2" /> Save Changes
									</>
								)}
							</Button>
							<Button
								onClick={handleCancel}
								variant="outline"
								disabled={isUpdating}
								className="flex-1 h-11 rounded-lg font-semibold"
							>
								<X className="size-4 mr-2" />
								Cancel
							</Button>
						</div>
					</form>
				</>
			)}
			{!isEditing && <ViewMode profile={profile} />}
		</CardContent>
	);
};

export default EditForm;
