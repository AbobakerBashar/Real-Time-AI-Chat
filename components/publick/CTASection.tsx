"use client";

import { motion } from "framer-motion";

const sectionTitleVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
		},
	},
};

const sectionDescriptionVariants = {
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

const ctaSectionVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
		},
	},
};

const ctaButtonVariants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.6,
			delay: 0.3,
		},
	},
	hover: {
		scale: 1.1,
		transition: { duration: 0.3 },
	},
	tap: { scale: 0.95 },
};

const CTASection = () => {
	return (
		<motion.section
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			variants={ctaSectionVariants}
			className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300 bg-linear-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
		>
			<div className="max-w-4xl mx-auto text-center">
				<motion.h2
					className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
					variants={sectionTitleVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
				>
					Ready to Chat with AI?
				</motion.h2>
				<motion.p
					className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
					variants={sectionDescriptionVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
				>
					Join millions of users who are already experiencing the power of
					real-time AI conversations.
				</motion.p>
				<motion.button
					className="px-10 py-4 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30 text-lg transform hover:scale-105"
					variants={ctaButtonVariants}
					initial="hidden"
					whileInView="visible"
					whileHover="hover"
					whileTap="tap"
					viewport={{ once: true, margin: "-100px" }}
				>
					Get Started Now
				</motion.button>
			</div>
		</motion.section>
	);
};

export default CTASection;
