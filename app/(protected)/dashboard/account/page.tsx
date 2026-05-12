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
import { Profile, UserProfile } from "@/types/auth";
import { Edit3, Mail, Save, User as UserIcon, X, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AccountPage() {
	const { data: user, isLoading: userLoading } = useCurrentUser();
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isLoadingProfile, setIsLoadingProfile] = useState(true);

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
		setIsEditing(false);
	};

	if (userLoading || isLoadingProfile) {
		return (
			<div className="space-y-6">
				<div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
			</div>
		);
	}

	if (!user || !profile) {
		return (
			<div className="text-center">
				<Card>
					<CardContent className="pt-6">
						<p className="text-muted-foreground">
							Unable to load account information. Please try again.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const initials = `${profile.full_name?.[0] || "U"}${
		profile.full_name?.split(" ")[1]?.[0] || ""
	}`.toUpperCase();

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-6"
		>
			{/* Header */}
			<motion.div variants={itemVariants}>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Account Settings
				</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-1">
					Manage your account information and profile details
				</p>
			</motion.div>

			{/* Profile Card */}
			<motion.div variants={itemVariants}>
				<Card>
					<CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							Profile Information
						</h2>
					</CardHeader>
					<CardContent className="pt-6 space-y-6">
						{isEditing ? (
							/* Edit Form */
							<div className="space-y-4">
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
							<>
								<div className="flex items-center gap-4">
									<Avatar size="lg">
										<AvatarImage
											src={profile.avatar_url || ""}
											alt={profile.full_name || "User"}
										/>
										<AvatarFallback>{initials}</AvatarFallback>
									</Avatar>
									<div>
										<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
											{profile.full_name || "User"}
										</h3>
										{profile.username && (
											<p className="text-sm text-gray-600 dark:text-gray-400">
												@{profile.username}
											</p>
										)}
									</div>
								</div>

								<div className="space-y-4 py-4 border-y border-gray-200 dark:border-white/10">
									{/* Full Name */}
									<div className="flex items-start gap-4 pb-4">
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
									<div className="flex items-start gap-4 pb-4">
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
											<p className="text-sm text-muted-foreground mb-1">
												Email
											</p>
											<p className="text-foreground font-medium">
												{user.email}
											</p>
										</div>
									</div>
								</div>

								<Button
									onClick={() => setIsEditing(true)}
									className="w-full md:w-auto"
								>
									<Edit3 className="size-4 mr-2" />
									Edit Profile
								</Button>
							</>
						)}
					</CardContent>
				</Card>
			</motion.div>

			{/* Security Section */}
			<motion.div variants={itemVariants}>
				<Card>
					<CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
							<Shield className="w-6 h-6" />
							Security
						</h2>
					</CardHeader>
					<CardContent className="pt-6 space-y-4">
						<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg">
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Change Password
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Update your password to keep your account secure
								</p>
							</div>
							<Button variant="outline">Change</Button>
						</div>
						<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg">
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Two-Factor Authentication
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Add an extra layer of security to your account
								</p>
							</div>
							<Button variant="outline">Enable</Button>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Danger Zone */}
			<motion.div variants={itemVariants}>
				<Card className="border-red-200 dark:border-red-900/50">
					<CardContent className="pt-6 space-y-4">
						<div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50 dark:bg-red-900/10">
							<div>
								<h3 className="font-semibold text-red-900 dark:text-red-100">
									Delete Account
								</h3>
								<p className="text-sm text-red-800 dark:text-red-200">
									Permanently delete your account and all associated data
								</p>
							</div>
							<Button variant="destructive">Delete</Button>
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</motion.div>
	);
}
