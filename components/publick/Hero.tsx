"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { User } from "@supabase/supabase-js";

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.3,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
		},
	},
};

const titleVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 1,
		},
	},
};

const buttonVariants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.6,
		},
	},
	hover: {
		scale: 1.05,
		transition: {
			duration: 0.3,
		},
	},
};

export default function Hero({ user }: { user: User | null }) {
	const isAuthenticated = !!user;

	return (
		<section className="relative h-[90vh] w-full overflow-hidden">
			{/* Animated Background Image */}
			<motion.div
				className="absolute inset-0"
				initial={{ scale: 1.05, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 1.2, ease: "easeOut" }}
			>
				<Image
					src="/hero.png"
					alt="AI Chat Hero"
					fill
					priority
					className="object-cover object-center"
				/>

				{/* Animated gradient overlay */}
				<motion.div
					className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1.5 }}
				></motion.div>

				{/* Animated accent lights */}
				<motion.div
					className="absolute top-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
					animate={{
						x: [0, 30, 0],
						y: [0, -20, 0],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				></motion.div>
				<motion.div
					className="absolute bottom-20 left-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"
					animate={{
						x: [0, -30, 0],
						y: [0, 20, 0],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				></motion.div>
			</motion.div>

			{/* Animated Badge */}
			<motion.div variants={itemVariants}>
				<motion.div
					// className="inline-block"
					className="inline-block absolute top-8 left-1/2 transform -translate-x-1/2 z-20"
					animate={{ y: [0, -10, 0] }}
					transition={{ duration: 3, repeat: Infinity }}
				>
					<Badge className="h-8 bg-blue-500/30 backdrop-blur-sm border border-blue-400/50 text-blue-100">
						✨ Real-Time AI Chat App
					</Badge>
				</motion.div>
			</motion.div>
			{/* Content */}
			<div className="relative -mt-3.5 z-10 h-full flex items-center justify-center px-6 sm:px-10 lg:px-20">
				<motion.div
					className="text-white space-y-3 text-center max-w-4xl mx-auto"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{/* Animated Title */}
					<motion.div variants={titleVariants}>
						<h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
							Chat with Advanced <br />
							<motion.span
								className="bg-linear-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
								animate={{
									backgroundPosition: ["0%", "100%", "0%"],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
								}}
							>
								Artificial Intelligence
							</motion.span>
						</h1>
					</motion.div>

					{/* Animated Subtitle */}
					<motion.p
						className="text-lg sm:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed"
						variants={itemVariants}
					>
						Experience fast, intelligent AI conversations. Get instant answers,
						create content, and explore new ideas — all inside one smart chat
						app.
					</motion.p>

					{/* Animated CTA Buttons */}
					<motion.div
						className="flex flex-col sm:flex-row gap-4 mt-4 justify-center"
						variants={itemVariants}
					>
						<motion.div
							variants={buttonVariants}
							whileHover="hover"
							whileTap={{ scale: 0.95 }}
						>
							<Link
								href={isAuthenticated ? "/chat" : "/auth/signup"}
								className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold bg-linear-to-r from-indigo-600 to-purple-600 text-white transition-all shadow-lg shadow-blue-500/50 gap-2"
							>
								Start Chatting Free
								<ArrowRight className="w-4 h-4" />
							</Link>
						</motion.div>
					</motion.div>
				</motion.div>
			</div>

			{/* Scroll indicator animation */}
			<motion.div
				className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
				animate={{ y: [0, 10, 0] }}
				transition={{ duration: 2, repeat: Infinity }}
			>
				<div className="flex flex-col items-center gap-2">
					<span className="text-sm text-white/60">Scroll to explore</span>
					<svg
						className="w-5 h-5 text-white/60"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 14l-7 7m0 0l-7-7m7 7V3"
						/>
					</svg>
				</div>
			</motion.div>
		</section>
	);
}
