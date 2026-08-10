"use client";

import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import Link from "next/link";

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

const contentVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			delay: 0.2,
		},
	},
};

const AboutCTASection = ({ user }: { user: User | null }) => {
	const isAuthenticated = !!user;

	return (
		<section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-purple-600">
			<div className="max-w-4xl mx-auto text-center">
				<motion.h2
					initial="hidden"
					whileInView="visible"
					variants={sectionTitleVariants}
					viewport={{ once: true }}
					className="text-3xl sm:text-4xl font-bold text-white mb-6"
				>
					Ready to Experience AI Chat?
				</motion.h2>
				<motion.p
					initial="hidden"
					whileInView="visible"
					variants={contentVariants}
					viewport={{ once: true }}
					className="text-lg text-white/90 mb-8"
				>
					Join thousands of users who are already transforming their
					communication with AI.
				</motion.p>
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					viewport={{ once: true }}
					className="flex gap-4 justify-center flex-wrap"
				>
					<Link
						href={isAuthenticated ? "/chat" : "/auth/signup"}
						className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-300"
					>
						Get Started
					</Link>
					<Link
						href="/contact"
						className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition duration-300"
					>
						Contact Us
					</Link>
				</motion.div>
			</div>
		</section>
	);
};

export default AboutCTASection;
