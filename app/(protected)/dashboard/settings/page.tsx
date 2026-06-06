import SettingsComponent from "@/components/dashboard/SettingsComponent";

export const metadata = {
	title: "Settings - Dashboard",
	description: "Customize your app experience with our settings page.",
};

export const dynamic = "force-dynamic";

export default function SettingsPage() {
	return <SettingsComponent />;
}
