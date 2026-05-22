import ContactHero from "@/components/publick/ContactHero";
import ContactInfo from "@/components/publick/ContactInfo";
import ContactForm from "@/components/publick/ContactForm";
import FAQSection from "@/components/publick/FAQSection";

export const metadata = {
	title: "Contact - AI Chat",
	description: "Get in touch with our team. We'd love to hear from you.",
};

export default function ContactPage() {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
			{/* Hero Section */}
			<ContactHero />
			{/* Contact Section */}
			<section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
						{/* Contact Info */}
						<ContactInfo />
						{/* Contact Form */}
						<ContactForm />
					</div>
				</div>
			</section>
			{/* FAQ Section */}
			<FAQSection />
		</div>
	);
}
