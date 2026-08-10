import { getRecentRooms } from "@/actions/messagesActions";
import { getCurrentUserProfile } from "@/actions/userAction";
import DashboardrPageComponent from "@/components/dashboard/DashboardrPageComponent";
import { Suspense } from "react";

export const metadata = {
	title: "Dashboard - ChatHub",
	description:
		"Your personalized dashboard to manage chats, settings, and profile.",
};

export const revalidate = 0;

const fetchUserData = async () => {
	try {
		const [user, recentRooms] = await Promise.all([
			getCurrentUserProfile(),
			getRecentRooms(),
		]);
		return { user, recentRooms };
	} catch (error) {
		console.error("Error fetching user data:", error);
		return { user: null, recentRooms: [] };
	}
};

export default async function DashboardrPage() {
	const { user, recentRooms } = await fetchUserData();

	return (
		<Suspense>
			<DashboardrPageComponent user={user} recentRooms={recentRooms} />
		</Suspense>
	);
}
