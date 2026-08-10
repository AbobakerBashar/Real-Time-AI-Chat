import { getCurrentUserProfile } from "@/actions/userAction";
import SettingsComponent from "@/components/dashboard/SettingsComponent";

export const metadata = {
	title: "Settings - Dashboard",
	description: "Customize your app experience with our settings page.",
};

export const dynamic = "force-dynamic";

const fetchProfile = async () => {
	try {
		const profile = await getCurrentUserProfile();
		return profile;
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : "Failed to fetch profile",
		);
	}
};

export default async function SettingsPage() {
	const profile = await fetchProfile();

	return <SettingsComponent profile={profile} />;
}
