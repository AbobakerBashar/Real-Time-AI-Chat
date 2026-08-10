import History from "@/components/publick/History";
import ValuesSection from "@/components/publick/ValuesSection";
import TeamSection from "@/components/publick/TeamSection";
import AboutCTASection from "@/components/publick/AboutCTASection";
import StatsSection from "@/components/publick/StatsSection";
import { getCurrentUser } from "@/actions/userAction";
import AboutHero from "@/components/publick/AboutHero";

export const metadata = {
	title: "About - AI Chat",
	description:
		"Learn about our AI Chat platform and our mission to revolutionize communication.",
};

const fetchCurrentUser = async () => {
	try {
		const user = await getCurrentUser();
		return user;
	} catch (error) {
		console.error("Error fetching current user:", error);
		return null;
	}
};

export default async function AboutPage() {
	const user = await fetchCurrentUser();

	return (
		<div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
			{/* Hero Section */}
			<AboutHero />
			{/* Stats Section */}
			<StatsSection />
			{/* Story Section */}
			<History />
			{/* Values Section */}
			<ValuesSection />
			{/* Team Section */}
			<TeamSection />
			{/* CTA Section */}
			<AboutCTASection user={user} />
		</div>
	);
}
