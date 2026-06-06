"use client";

import { MessageSquare, Sparkles } from "lucide-react";
import { motion, Variants } from "framer-motion";

const Logo = () => {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants: Variants = {
		hidden: { scale: 0.5, opacity: 0 },
		visible: {
			scale: 1,
			opacity: 1,
			transition: {
				duration: 0.5,
				ease: "easeOut",
			},
		},
	};

	return (
		<motion.div
			className="flex items-center gap-2.5"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
		>
			{/* Logo Icon */}
			<motion.div
				className="relative group"
				variants={itemVariants}
				whileHover={{ scale: 1.05 }}
				transition={{ duration: 0.2 }}
			>
				<div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300" />
				<div className="relative w-10 h-10 bg-linear-to-br from-blue-600 via-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
					<div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white/50 transition duration-300" />
					<div className="relative z-10 flex items-center justify-center">
						<MessageSquare className="w-5 h-5 text-white" strokeWidth={2.5} />
					</div>
					<motion.div
						className="absolute inset-0 rounded-xl bg-linear-to-r from-white/0 via-white/20 to-white/0"
						animate={{
							x: ["100%", "-100%"],
						}}
						transition={{
							duration: 3,
							repeat: Infinity,
							ease: "linear",
						}}
					/>
				</div>
			</motion.div>

			{/* Text Logo */}
			<motion.div className="flex flex-col" variants={itemVariants}>
				<div className="flex items-center gap-1.5">
					<span className="text-lg font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						ChatAI
					</span>
					<motion.div
						animate={{
							scale: [1, 1.2, 1],
							rotate: [0, 10, -10, 0],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
						}}
					>
						<Sparkles
							className="w-3.5 h-3.5 text-purple-500"
							strokeWidth={2.5}
						/>
					</motion.div>
				</div>
				<span className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide">
					Real-time AI
				</span>
			</motion.div>
		</motion.div>
	);
};

export default Logo;
