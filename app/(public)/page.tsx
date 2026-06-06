import { getCurrentUser } from "@/actions/userAction";
import CTASection from "@/components/publick/CTASection";
import Features from "@/components/publick/Features";
import Hero from "@/components/publick/Hero";

export const metadata = {
	title: "ChatAI - Real-time AI Chat Application",
	description:
		"Experience the future of communication with ChatAI, a real-time AI chat application that delivers instant, intelligent responses. Powered by cutting-edge technology, ChatAI provides seamless interactions for both casual conversations and professional use. Join us today and revolutionize the way you communicate!",
};

const fetchUser = async () => {
	try {
		const user = await getCurrentUser();
		return user;
	} catch {
		return null;
	}
};

export default async function Home() {
	const user = await fetchUser();

	return (
		<div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
			{/* Hero Section */}
			<Hero user={user} />

			{/* Features Section */}
			<Features />

			{/* CTA Section */}
			<CTASection user={user} />
		</div>
	);
}
