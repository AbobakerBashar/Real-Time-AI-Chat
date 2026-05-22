"use client";

import { Zap, Users, Target, Heart } from "lucide-react";
import { motion } from "framer-motion";

const valueCardVariants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: (i: number) => ({
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.6,
			delay: i * 0.1,
		},
	}),
	hover: {
		scale: 1.05,
		transition: { duration: 0.3 },
	},
};

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

const values = [
	{
		icon: Target,
		title: "Our Mission",
		description:
			"To empower users with intelligent, real-time communication tools that enhance productivity and connection.",
	},
	{
		icon: Zap,
		title: "Innovation First",
		description:
			"We continuously push the boundaries of AI technology to deliver cutting-edge solutions.",
	},
	{
		icon: Users,
		title: "Community Driven",
		description:
			"Our platform is built by and for our community of users who inspire us every day.",
	},
	{
		icon: Heart,
		title: "User-Centric",
		description:
			"Every feature and decision is guided by the needs and feedback of our users.",
	},
];

const ValuesSection = () => {
	return (
		<section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
			<div className="max-w-6xl mx-auto">
				<motion.h2
					initial="hidden"
					whileInView="visible"
					variants={sectionTitleVariants}
					viewport={{ once: true }}
					className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center"
				>
					Our Values
				</motion.h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{values.map((value, index) => {
						const Icon = value.icon;
						return (
							<motion.div
								key={index}
								custom={index}
								initial="hidden"
								whileInView="visible"
								variants={valueCardVariants}
								whileHover="hover"
								viewport={{ once: true }}
								className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
							>
								<Icon className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-4" />
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
									{value.title}
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									{value.description}
								</p>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default ValuesSection;
