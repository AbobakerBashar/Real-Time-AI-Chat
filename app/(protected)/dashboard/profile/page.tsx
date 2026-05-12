import { getCurrentUserProfile } from "@/actions/userAction";
import LogoutButton from "@/components/common/LogoutButton";
import AccountInfo from "@/components/dashboard/AccountInfo";
import EditForm from "@/components/dashboard/EditForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Profile - ChatHub",
	description: "View and edit your profile information on ChatHub.",
};

const loadProfile = async () => {
	try {
		const profile = await getCurrentUserProfile();
		return profile;
	} catch (error) {
		console.log("Error loading profile:", error);
		if (error instanceof Error) {
			throw new Error(error.message || "Failed to load profile");
		}

		throw new Error("Failed to load profile");
	}
};

export default async function ProfilePage() {
	const profile = await loadProfile();

	if (!profile) {
		return (
			<div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black p-4 md:p-8">
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

	const initials = `${profile?.full_name?.[0] || "U"}${
		profile?.full_name?.split(" ")[1]?.[0] || ""
	}`.toUpperCase();

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black p-4 md:p-8 transition-colors duration-300">
			<div className="max-w-2xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold text-foreground">Profile</h1>
					<LogoutButton />
				</div>

				{/* Profile Card */}
				<Card className="overflow-hidden pt-0">
					{/* Avatar Section */}
					<div className="bg-linear-to-r from-blue-500 to-purple-600 h-32" />

					<CardHeader className="relative pb-0">
						{/* Avatar */}
						<div className="flex items-end gap-4 mb-4 -mt-24 relative z-10">
							<Avatar
								size="lg"
								className="ring-4 ring-white dark:ring-gray-950"
							>
								<AvatarImage
									src={profile?.avatar_url || ""}
									alt={profile?.full_name || "User"}
								/>
								<AvatarFallback>{initials}</AvatarFallback>
							</Avatar>
							<div className="flex-1 pb-2">
								<h2 className="text-2xl font-bold text-foreground">
									{profile?.full_name || "User"}
								</h2>
								{profile?.username && (
									<p className="text-sm text-muted-foreground">
										@{profile.username}
									</p>
								)}
							</div>
						</div>
					</CardHeader>

					{/* Edit Form */}
					<EditForm profile={profile} />
				</Card>

				{/* Account Info */}
				<AccountInfo
					profileId={profile?.id || ""}
					createdAt={profile?.created_at}
				/>
			</div>
		</div>
	);
}
