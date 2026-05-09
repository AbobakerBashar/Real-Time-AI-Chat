import Footer from "@/components/publick/Footer";
import Header from "@/components/publick/Header";

export const metadata = {
	title: "Home - AI Chat",
	description:
		"Experience the future of communication with our AI-powered chat platform.",
};

const PublicLayout = ({
	children,
}: Readonly<{ children: React.ReactNode }>) => {
	return (
		<main className="min-h-screen flex flex-col">
			<Header />
			{children}
			<Footer />
		</main>
	);
};

export default PublicLayout;
