"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/common/Logo";

const layoutVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 0.5,
		},
	},
};

const imageVariants = {
	hidden: { opacity: 0, x: -50 },
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.8,
		},
	},
};

const formVariants = {
	hidden: { opacity: 0, x: 50 },
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.8,
		},
	},
};

const AuthComponent = ({
	children,
}: Readonly<{ children: React.ReactNode }>) => {
	return (
		<motion.main
			variants={layoutVariants}
			initial="hidden"
			animate="visible"
			className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300"
		>
			<div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
				{/* Image Section */}
				<motion.div
					variants={imageVariants}
					initial="hidden"
					animate="visible"
					className="hidden lg:flex relative bg-linear-to-br from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900"
				>
					<Image
						src="/hero.png"
						alt="Auth Background"
						fill
						priority
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />

					{/* Logo and Text Overlay */}
					<div className="relative z-10 flex flex-col justify-between p-8 text-white">
						<Link href="/">
							<Logo />
						</Link>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.8 }}
						>
							<h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
							<p className="text-lg text-white/90 max-w-md">
								Experience powerful AI conversations in real-time. Join millions
								of users transforming their productivity.
							</p>
						</motion.div>
					</div>
				</motion.div>

				{/* Form Section */}
				<motion.div
					variants={formVariants}
					initial="hidden"
					animate="visible"
					className="flex items-center justify-center p-6 sm:p-8 lg:p-12"
				>
					<div className="w-full max-w-md">
						{/* Mobile Logo */}
						<div className="lg:hidden mb-8 flex justify-center">
							<Link href="/">
								<Logo />
							</Link>
						</div>

						{children}
					</div>
				</motion.div>
			</div>
		</motion.main>
	);
};

export default AuthComponent;
