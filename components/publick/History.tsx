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

const History = () => {
	return (
		<section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={{
						hidden: { opacity: 0 },
						visible: {
							opacity: 1,
							transition: { staggerChildren: 0.2 },
						},
					}}
				>
					<motion.h2
						variants={sectionTitleVariants}
						className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6"
					>
						Our Story
					</motion.h2>
					<motion.div
						variants={contentVariants}
						className="space-y-4 text-gray-600 dark:text-gray-300"
					>
						<p className="text-lg leading-relaxed">
							Founded in 2024, AI Chat emerged from a simple belief:
							communication should be smarter, faster, and more human. Our
							founding team recognized the potential for AI to transform how
							people interact with technology and each other.
						</p>
						<p className="text-lg leading-relaxed">
							We started as a lean team of engineers and designers, working
							across time zones to build something remarkable. What began as an
							experiment quickly gained traction, attracting users who believed
							in our vision.
						</p>
						<p className="text-lg leading-relaxed">
							Today, we&apos;re proud to serve hundreds of thousands of users
							globally. But we&apos;re just getting started. We continue to
							innovate, improve, and expand our platform to meet the evolving
							needs of our community.
						</p>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default History;
