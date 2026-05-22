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

const ContactHero = () => {
	return (
		<section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<motion.h1
					initial="hidden"
					animate="visible"
					variants={sectionTitleVariants}
					className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 text-center"
				>
					Get in Touch
				</motion.h1>
				<motion.p
					initial="hidden"
					animate="visible"
					variants={contentVariants}
					className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 text-center"
				>
					We&apos;re here to help and answer any question you might have. Reach
					out to us and we&apos;ll respond as soon as possible.
				</motion.p>
			</div>
		</section>
	);
};

export default ContactHero;
