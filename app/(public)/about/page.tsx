import History from "@/components/publick/History";
import ValuesSection from "@/components/publick/ValuesSection";
import TeamSection from "@/components/publick/TeamSection";
import AboutCTASection from "@/components/publick/AboutCTASection";
import StatsSection from "@/components/publick/StatsSection";

export const metadata = {
	title: "About - AI Chat",
	description:
		"Learn about our AI Chat platform and our mission to revolutionize communication.",
};

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
			{/* Hero Section */}
			<AboutCTASection />
			{/* Stats Section */}
			<StatsSection />
			{/* Story Section */}
			<History />
			{/* Values Section */}
			<ValuesSection />
			{/* Team Section */}
			<TeamSection />
			{/* CTA Section */}
			<AboutCTASection />
		</div>
	);
}
