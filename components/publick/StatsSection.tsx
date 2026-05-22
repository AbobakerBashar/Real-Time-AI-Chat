"use client";

import { motion } from "framer-motion";

const stats = [
	{ number: "50K+", label: "Daily Active Users" },
	{ number: "2M+", label: "Messages per Day" },
	{ number: "150+", label: "Countries" },
	{ number: "99.9%", label: "Uptime Guarantee" },
];

const StatsSection = () => {
	return (
		<section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
			<div className="max-w-6xl mx-auto">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					{stats.map((stat, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
							className="text-center"
						>
							<div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
								{stat.number}
							</div>
							<p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
								{stat.label}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default StatsSection;
