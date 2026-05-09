import CTASection from "@/components/publick/CTASection";
import Features from "@/components/publick/Features";
import Hero from "@/components/publick/Hero";

export default function Home() {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
			{/* Hero Section */}
			<Hero />

			{/* Features Section */}
			<Features />

			{/* CTA Section */}
			<CTASection />
		</div>
	);
}
