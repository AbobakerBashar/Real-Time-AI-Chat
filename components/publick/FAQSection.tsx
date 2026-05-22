"use client";

import { motion } from "framer-motion";

const sectionTitleVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
		},
	},
};

const FAQSection = () => {
	return (
		<section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
			<div className="max-w-4xl mx-auto">
				<motion.h2
					initial="hidden"
					whileInView="visible"
					variants={sectionTitleVariants}
					viewport={{ once: true }}
					className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center"
				>
					Frequently Asked Questions
				</motion.h2>

				<div className="space-y-6">
					{[
						{
							q: "How can I report a bug or issue?",
							a: "Please use the contact form above or email us at hello@aichat.com with details about the issue.",
						},
						{
							q: "What is your support availability?",
							a: "Our team is available Monday to Friday, 9 AM to 6 PM PST. We respond to all inquiries within 24 hours.",
						},
						{
							q: "Do you offer enterprise support?",
							a: "Yes! We offer custom enterprise plans with dedicated support. Contact our sales team for more information.",
						},
						{
							q: "How can I request a feature?",
							a: "We love hearing from our users. Submit feature requests through our contact form or email us directly.",
						},
					].map((faq, index) => (
						<motion.div
							key={index}
							initial="hidden"
							whileInView="visible"
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: {
									opacity: 1,
									y: 0,
									transition: {
										duration: 0.6,
										delay: index * 0.1,
									},
								},
							}}
							viewport={{ once: true }}
							className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
						>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
								{faq.q}
							</h3>
							<p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default FAQSection;
