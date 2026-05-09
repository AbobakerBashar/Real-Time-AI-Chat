"use client";

import { Menu, X, Moon, Sun, MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../common/ThemeProvider";
import Logo from "../common/Logo";
import { useCurrentUser } from "@/hooks/useAuth";
import LogoutButton from "../common/LogoutButton";

const headerVariants = {
	hidden: { opacity: 0, y: -20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
		},
	},
};

const logoVariants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.5,
			delay: 0.1,
		},
	},
	hover: {
		scale: 1.05,
		transition: { duration: 0.2 },
	},
};

const navLinkVariants = {
	hidden: { opacity: 0, y: -10 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			delay: 0.2 + i * 0.1,
		},
	}),
	hover: {
		y: -2,
		transition: { duration: 0.2 },
	},
};

const buttonVariants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: (i: number) => ({
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.5,
			delay: 0.5 + i * 0.1,
		},
	}),
	hover: {
		scale: 1.08,
		transition: { duration: 0.2 },
	},
	tap: { scale: 0.95 },
};

const themeButtonVariants = {
	hidden: { opacity: 0, rotate: -180 },
	visible: {
		opacity: 1,
		rotate: 0,
		transition: {
			duration: 0.5,
			delay: 0.4,
		},
	},
	hover: { rotate: 20 },
};

const mobileMenuVariants = {
	hidden: { opacity: 0, height: 0 },
	visible: {
		opacity: 1,
		height: "auto",
		transition: {
			duration: 0.3,
		},
	},
	exit: { opacity: 0, height: 0 },
};

const mobileNavItemVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.3,
			delay: i * 0.05,
		},
	}),
};

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const { theme, toggleTheme } = useTheme();
	const { data: user, isLoading, isFetching } = useCurrentUser();
	const isAuthenticated = !isLoading && !isFetching && !!user;

	const navLinks = [
		{ href: "/", label: "Home" },
		{ href: "/pricing", label: "Pricing" },
		{ href: "/about", label: "About" },
		{ href: "/contact", label: "Contact" },
	];

	return (
		<motion.header
			initial="hidden"
			animate="visible"
			variants={headerVariants}
			className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between py-4">
					{/* Logo */}
					<motion.div
						variants={logoVariants}
						initial="hidden"
						animate="visible"
						whileHover="hover"
					>
						<Link
							href="/"
							className="flex items-center gap-2 hover:opacity-80 transition"
						>
							<Logo />
						</Link>
					</motion.div>

					{/* Desktop Navigation */}
					<nav className="hidden lg:flex items-center gap-8">
						{navLinks.map((link, i) => (
							<motion.div
								key={link.href}
								variants={navLinkVariants}
								initial="hidden"
								animate="visible"
								custom={i}
								whileHover="hover"
								className="relative"
							>
								<Link
									href={link.href}
									className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200 font-medium"
								>
									{link.label}
								</Link>
								<motion.div
									className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 origin-left"
									initial={{ scaleX: 0 }}
									whileHover={{ scaleX: 1 }}
									transition={{ duration: 0.3 }}
								/>
							</motion.div>
						))}
					</nav>

					{/* Desktop Theme Toggle & Auth Links */}

					<div className="hidden lg:flex items-center gap-4">
						<motion.button
							onClick={toggleTheme}
							className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition duration-200"
							aria-label="Toggle theme"
							variants={themeButtonVariants}
							initial="hidden"
							animate="visible"
							whileHover="hover"
							whileTap={{ scale: 0.9 }}
						>
							{theme === "dark" ? (
								<Sun className="w-5 h-5 text-yellow-500" />
							) : (
								<Moon className="w-5 h-5 text-gray-600" />
							)}{" "}
						</motion.button>
						{isAuthenticated ? (
							<>
								<motion.div
									variants={buttonVariants}
									initial="hidden"
									animate="visible"
									custom={0}
									whileHover="hover"
									whileTap="tap"
								>
									<Link
										href="/chat"
										className="flex items-center gap-2 px-6 py-2 bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/30 transform hover:scale-105 duration-300"
									>
										<MessageSquarePlus className="w-4 h-4" />
										Chat
									</Link>
								</motion.div>
								<LogoutButton />
							</>
						) : (
							<>
								<motion.div
									variants={buttonVariants}
									initial="hidden"
									animate="visible"
									custom={0}
									whileHover="hover"
									whileTap="tap"
								>
									<Link
										href="/auth/login"
										className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
									>
										Login
									</Link>
								</motion.div>
								<motion.div
									variants={buttonVariants}
									initial="hidden"
									animate="visible"
									custom={1}
									whileHover="hover"
									whileTap="tap"
								>
									<Link
										href="/auth/signup"
										className="px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30 transform hover:scale-105 duration-300"
									>
										Sign Up
									</Link>
								</motion.div>
							</>
						)}
					</div>

					{/* Mobile Theme Toggle & Menu Button */}
					<div className="lg:hidden flex items-center gap-2">
						<motion.button
							onClick={toggleTheme}
							className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition duration-200"
							aria-label="Toggle theme"
							whileHover={{ rotate: 20 }}
							whileTap={{ scale: 0.9 }}
						>
							{theme === "dark" ? (
								<Sun className="w-6 h-6 text-yellow-500" />
							) : (
								<Moon className="w-6 h-6 text-gray-600" />
							)}
						</motion.button>
						<motion.button
							onClick={() => setIsOpen(!isOpen)}
							className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition duration-200"
							aria-label="Toggle menu"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
						>
							<motion.div
								animate={{ rotate: isOpen ? 180 : 0 }}
								transition={{ duration: 0.3 }}
							>
								{isOpen ? (
									<X className="w-6 h-6 text-gray-900 dark:text-white" />
								) : (
									<Menu className="w-6 h-6 text-gray-900 dark:text-white" />
								)}
							</motion.div>
						</motion.button>
					</div>
				</div>

				{/* Mobile Navigation */}
				<motion.div
					variants={mobileMenuVariants}
					initial="hidden"
					animate={isOpen ? "visible" : "exit"}
					className="lg:hidden border-t border-gray-200 dark:border-gray-800 mt-4 transition-colors duration-300 overflow-hidden"
				>
					<div className="pb-4">
						<nav className="flex flex-col gap-2 mb-4">
							{navLinks.map((link, i) => (
								<motion.div
									key={link.href}
									variants={mobileNavItemVariants}
									initial="hidden"
									animate={isOpen ? "visible" : "hidden"}
									custom={i}
								>
									<Link
										href={link.href}
										className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition duration-200"
										onClick={() => setIsOpen(false)}
									>
										{link.label}
									</Link>
								</motion.div>
							))}
						</nav>

						{/* Mobile Auth Links */}
						<div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
							{isAuthenticated ? (
								<>
									<motion.div
										variants={mobileNavItemVariants}
										initial="hidden"
										animate={isOpen ? "visible" : "hidden"}
										custom={navLinks.length}
									>
										<Link
											href="/chat"
											className="flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition duration-300 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/30 transform hover:scale-105"
											onClick={() => setIsOpen(false)}
										>
											<MessageSquarePlus className="w-4 h-4" />
											<span>Go to Chat</span>
										</Link>
									</motion.div>
									<LogoutButton />
								</>
							) : (
								<>
									<motion.div
										variants={mobileNavItemVariants}
										initial="hidden"
										animate={isOpen ? "visible" : "hidden"}
										custom={navLinks.length}
									>
										<Link
											href="/auth/login"
											className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition duration-200 text-center font-medium"
											onClick={() => setIsOpen(false)}
										>
											Login
										</Link>
									</motion.div>
									<motion.div
										variants={mobileNavItemVariants}
										initial="hidden"
										animate={isOpen ? "visible" : "hidden"}
										custom={navLinks.length + 1}
									>
										<Link
											href="/auth/signup"
											className="block px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition duration-300 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30 text-center transform hover:scale-105"
											onClick={() => setIsOpen(false)}
										>
											Sign Up
										</Link>
									</motion.div>
								</>
							)}
						</div>
					</div>
				</motion.div>
			</div>
		</motion.header>
	);
}
