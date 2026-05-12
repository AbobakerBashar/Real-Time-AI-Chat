"use client";

import { getCurrentUserProfile } from "@/actions/userAction";
import LogoutButton from "@/components/common/LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types/auth";
import {
	Edit3,
	Image as ImageIcon,
	Loader2,
	Mail,
	Save,
	User as UserIcon,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
	const { data: user, isLoading: userLoading } = useCurrentUser();
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isLoadingProfile, setIsLoadingProfile] = useState(true);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

	const [editForm, setEditForm] = useState({
		full_name: "",
		username: "",
	});

	useEffect(() => {
		const loadProfile = async () => {
			try {
				setIsLoadingProfile(true);
				const userProfile = await getCurrentUserProfile();
				if (userProfile) {
					setProfile(userProfile);
					setEditForm({
						full_name: userProfile.full_name || "",
						username: userProfile.username || "",
					});
				}
			} catch (error) {
				console.error("Error loading profile:", error);
				toast.error("Failed to load profile");
			} finally {
				setIsLoadingProfile(false);
			}
		};

		if (user) {
			loadProfile();
		}
	}, [user]);

	const handleSaveProfile = async () => {
		if (!user) return;

		try {
			setIsSaving(true);
			const supabase = createClient();

			const { error } = await supabase
				.from("profiles")
				.update({
					full_name: editForm.full_name,
					username: editForm.username,
				})
				.eq("id", user.id);

			if (error) {
				throw error;
			}

			setProfile({
				...profile!,
				full_name: editForm.full_name,
				username: editForm.username,
			});

			setIsEditing(false);
			toast.success("Profile updated successfully!");
		} catch (error) {
			console.error("Error updating profile:", error);
			toast.error("Failed to update profile");
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		if (profile) {
			setEditForm({
				full_name: profile.full_name || "",
				username: profile.username || "",
			});
		}
		setAvatarPreview(null);
		setIsEditing(false);
	};

	const handleAvatarChange = async (file: File | null) => {
		if (!file || !user) return;

		// Validate file
		if (!file.type.startsWith("image/")) {
			toast.error("Please select a valid image file");
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image size must be less than 5MB");
			return;
		}

		try {
			setIsUploadingAvatar(true);
			const supabase = createClient();

			// Create preview
			const reader = new FileReader();
			reader.onload = (e) => {
				setAvatarPreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);

			// Upload to Supabase Storage
			const fileExt = file.name.split(".").pop();
			const fileName = `${user.id}-${Date.now()}.${fileExt}`;
			const filePath = `avatars/${fileName}`;

			const { error: uploadError, data } = await supabase.storage
				.from("profiles")
				.upload(filePath, file, { upsert: true });

			if (uploadError) {
				throw uploadError;
			}

			// Get public URL
			const { data: publicData } = supabase.storage
				.from("profiles")
				.getPublicUrl(filePath);

			const publicUrl = publicData.publicUrl;

			// Update profile with new avatar URL
			const { error: updateError } = await supabase
				.from("profiles")
				.update({ avatar_url: publicUrl })
				.eq("id", user.id);

			if (updateError) {
				throw updateError;
			}

			setProfile({
				...profile!,
				avatar_url: publicUrl,
			});

			toast.success("Avatar updated successfully!");
		} catch (error) {
			console.error("Error uploading avatar:", error);
			toast.error("Failed to upload avatar");
			setAvatarPreview(null);
		} finally {
			setIsUploadingAvatar(false);
		}
	};

	if (userLoading || isLoadingProfile) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black p-4 md:p-8">
				<div className="max-w-2xl mx-auto">
					<div className="animate-pulse space-y-4">
						<div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
					</div>
				</div>
			</div>
		);
	}

	if (!user || !profile) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black p-4 md:p-8">
				<div className="max-w-2xl mx-auto text-center">
					<Card>
						<CardContent className="pt-6">
							<p className="text-muted-foreground">
								Unable to load profile. Please try again.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	const initials = `${profile.full_name?.[0] || "U"}${
		profile.full_name?.split(" ")[1]?.[0] || ""
	}`.toUpperCase();

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black p-4 md:p-8 transition-colors duration-300">
			<div className="max-w-2xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold text-foreground">Profile</h1>
					<LogoutButton />
				</div>

				{/* Profile Card */}
				<Card className="overflow-hidden">
					{/* Avatar Section */}
					<div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32" />

					<CardHeader className="relative pb-0">
						{/* Avatar */}
						<div className="flex items-end gap-4 mb-4 -mt-16 relative z-10">
							<Avatar
								size="lg"
								className="ring-4 ring-white dark:ring-gray-950"
							>
								<AvatarImage
									src={profile.avatar_url || ""}
									alt={profile.full_name || "User"}
								/>
								<AvatarFallback>{initials}</AvatarFallback>
							</Avatar>
							<div className="flex-1 pb-2">
								<h2 className="text-2xl font-bold text-foreground">
									{isEditing ? "Edit Profile" : profile.full_name || "User"}
								</h2>
								{!isEditing && profile.username && (
									<p className="text-sm text-muted-foreground">
										@{profile.username}
									</p>
								)}
							</div>
							<div className="pb-2">
								{!isEditing ? (
									<Button
										onClick={() => setIsEditing(true)}
										variant="outline"
										size="sm"
									>
										<Edit3 className="size-4 mr-2" />
										Edit
									</Button>
								) : null}
							</div>
						</div>
					</CardHeader>

					<CardContent className="space-y-6">
						{isEditing ? (
							/* Edit Form */
							<div className="space-y-4">
								{/* Avatar Upload */}
								<div className="space-y-2">
									<Label htmlFor="avatar" className="text-base">
										<ImageIcon className="inline mr-2 size-4" />
										Profile Picture
									</Label>
									<div className="flex gap-4 items-start">
										{/* Avatar Preview */}
										<Avatar className="size-24 ring-2 ring-border">
											<AvatarImage
												src={avatarPreview || profile.avatar_url || ""}
												alt={profile.full_name || "User"}
											/>
											<AvatarFallback>{initials}</AvatarFallback>
										</Avatar>

										{/* Upload Input */}
										<div className="flex-1">
											<div className="relative">
												<Input
													id="avatar"
													type="file"
													accept="image/*"
													onChange={(e) =>
														handleAvatarChange(e.target.files?.[0] || null)
													}
													disabled={isUploadingAvatar || isSaving}
													className="cursor-pointer"
												/>
											</div>
											{isUploadingAvatar && (
												<div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
													<Loader2 className="size-4 animate-spin" />
													Uploading...
												</div>
											)}
											<p className="text-xs text-muted-foreground mt-2">
												JPG, PNG or GIF. Max 5MB.
											</p>
										</div>
									</div>
								</div>

								{/* Full Name */}
								<div className="space-y-2">
									<Label htmlFor="full-name" className="text-base">
										<UserIcon className="inline mr-2 size-4" />
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
										disabled={isSaving}
									/>
								</div>

								{/* Username */}
								<div className="space-y-2">
									<Label htmlFor="username" className="text-base">
										<UserIcon className="inline mr-2 size-4" />
										Username
									</Label>
									<div className="flex items-center gap-2">
										<span className="text-muted-foreground">@</span>
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
											disabled={isSaving}
										/>
									</div>
								</div>

								{/* Email (Read-only) */}
								<div className="space-y-2">
									<Label htmlFor="email" className="text-base">
										<Mail className="inline mr-2 size-4" />
										Email
									</Label>
									<Input
										id="email"
										value={user.email || ""}
										disabled
										className="opacity-50"
									/>
									<p className="text-xs text-muted-foreground">
										Email cannot be changed
									</p>
								</div>

								{/* Action Buttons */}
								<div className="flex gap-2 pt-4">
									<Button
										onClick={handleSaveProfile}
										disabled={isSaving}
										className="flex-1"
									>
										<Save className="size-4 mr-2" />
										{isSaving ? "Saving..." : "Save Changes"}
									</Button>
									<Button
										onClick={handleCancel}
										variant="outline"
										disabled={isSaving}
										className="flex-1"
									>
										<X className="size-4 mr-2" />
										Cancel
									</Button>
								</div>
							</div>
						) : (
							/* View Mode */
							<div className="space-y-4">
								{/* Full Name */}
								<div className="flex items-start gap-4 pb-4 border-b border-border">
									<UserIcon className="size-5 text-muted-foreground mt-1" />
									<div className="flex-1">
										<p className="text-sm text-muted-foreground mb-1">
											Full Name
										</p>
										<p className="text-foreground font-medium">
											{profile.full_name || "Not set"}
										</p>
									</div>
								</div>

								{/* Username */}
								<div className="flex items-start gap-4 pb-4 border-b border-border">
									<UserIcon className="size-5 text-muted-foreground mt-1" />
									<div className="flex-1">
										<p className="text-sm text-muted-foreground mb-1">
											Username
										</p>
										<p className="text-foreground font-medium">
											{profile.username ? `@${profile.username}` : "Not set"}
										</p>
									</div>
								</div>

								{/* Email */}
								<div className="flex items-start gap-4">
									<Mail className="size-5 text-muted-foreground mt-1" />
									<div className="flex-1">
										<p className="text-sm text-muted-foreground mb-1">Email</p>
										<p className="text-foreground font-medium">{user.email}</p>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Account Info */}
				<Card>
					<CardHeader>
						<h3 className="text-lg font-semibold">Account Information</h3>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex justify-between items-center text-sm">
							<span className="text-muted-foreground">User ID</span>
							<code className="text-xs bg-muted px-2 py-1 rounded">
								{user.id.substring(0, 12)}...
							</code>
						</div>
						<div className="flex justify-between items-center text-sm">
							<span className="text-muted-foreground">Member Since</span>
							<span className="font-medium">
								{new Date(user.created_at).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
