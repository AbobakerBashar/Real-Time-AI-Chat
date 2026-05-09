"use client";

import { motion } from "framer-motion";
import { Brain, Clock, Lock, MessageCircle, Users, Zap } from "lucide-react";

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

const featureCardVariants = {
	hidden: { opacity: 0, scale: 0.8, y: 20 },
	visible: (i: number) => ({
		opacity: 1,
		scale: 1,
		y: 0,
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

const features = [
	{
		icon: Zap,
		title: "Lightning Fast",
		description: "Real-time responses powered by cutting-edge AI technology",
	},
	{
		icon: Brain,
		title: "Intelligent",
		description: "Advanced AI models that understand context and nuance",
	},
	{
		icon: Lock,
		title: "Secure",
		description: "Your conversations are encrypted and private",
	},
	{
		icon: Clock,
		title: "Always Available",
		description: "24/7 access to AI assistance whenever you need it",
	},
	{
		icon: Users,
		title: "Collaborate",
		description: "Share conversations and work together seamlessly",
	},
	{
		icon: MessageCircle,
		title: "Multi-turn",
		description: "Maintain context across multiple message exchanges",
	},
];

const Features = () => {
	return (
		<motion.section
			id="features"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-100px" }}
			className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300"
		>
			<div className="max-w-6xl mx-auto">
				<motion.div
					className="text-center mb-16"
					variants={sectionTitleVariants}
				>
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
						Powerful Features
					</h2>
				</motion.div>

				<motion.p
					className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto text-center mb-16"
					variants={sectionDescriptionVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
				>
					Everything you need for productive conversations with AI
				</motion.p>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<motion.div
								key={index}
								custom={index}
								variants={featureCardVariants}
								initial="hidden"
								whileInView="visible"
								whileHover="hover"
								viewport={{ once: true, margin: "-100px" }}
								className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 group shadow-sm hover:shadow-md dark:hover:shadow-blue-500/10"
							>
								<motion.div
									className="mb-4 inline-block p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition duration-300"
									whileHover={{ rotate: 10 }}
								>
									<Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
								</motion.div>
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
									{feature.title}
								</h3>
								<p className="text-gray-600 dark:text-gray-400">
									{feature.description}
								</p>
							</motion.div>
						);
					})}
				</div>
			</div>
		</motion.section>
	);
};

export default Features;
