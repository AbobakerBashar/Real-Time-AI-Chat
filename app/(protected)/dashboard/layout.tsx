import DashboardHeader from "@/components/dashboard/Header";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { getCurrentUserProfile } from "@/actions/userAction";

export const metadata = {
	title: "Dashboard - ChatHub",
	description:
		"Your personalized dashboard to manage chats, settings, and profile.",
};

const getProfile = async () => {
	try {
		const profile = await getCurrentUserProfile();
		return profile;
	} catch (error) {
		throw new Error(
			error instanceof Error
				? "Failed to fetch user profile: " + error.message
				: "Failed to fetch user profile",
		);
	}
};

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const profile = await getProfile();

	return (
		<div className="relative min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black transition-colors duration-300">
			{/* Header */}
			<DashboardHeader profile={profile} />

			{/* Main Content with Sidebar */}
			<main className="flex-1">
				<div className="flex">
					{/* Sidebar - hidden on mobile/tablet, visible on desktop */}
					<aside className="hidden md:block w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950/50 fixed h-screen top-20 p-4  pt-8">
						<DashboardSidebar />
					</aside>

					{/* Main Content */}
					<div className="flex-1 px-4 md:px-6 py-6 md:py-8 ml-0 md:ml-64">
						<div className="max-w-6xl mx-auto">{children}</div>
					</div>
				</div>
			</main>
		</div>
	);
}
