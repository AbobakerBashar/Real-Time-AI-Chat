"use client";

import {
	Menu,
	X,
	Moon,
	Sun,
	MessageSquarePlus,
	Home,
	Mail,
	Users,
	BadgeDollarSign,
	LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../common/ThemeProvider";
import Logo from "../common/Logo";
import { useCurrentUser } from "@/hooks/useAuth";
import LogoutButton from "../common/LogoutButton";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetFooter,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
	{ href: "/", label: "Home", Icon: Home },
	{ href: "/pricing", label: "Pricing", Icon: BadgeDollarSign },
	{ href: "/about", label: "About", Icon: Users },
	{ href: "/contact", label: "Contact", Icon: Mail },
];

const isActiveLink = (pathname: string, href: string) => {
	if (href === "/") {
		return pathname === "/";
	}
	return pathname === href;
};

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const { theme, toggleTheme } = useTheme();
	const { data: user, isLoading, isFetching } = useCurrentUser();
	const isAuthenticated = !isLoading && !isFetching && !!user;
	const pathname = usePathname();

	return (
		<motion.header
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link href="/" className="hover:opacity-80 transition">
						<Logo />
					</Link>

					{/* Desktop Nav */}
					<nav className="hidden md:flex items-center gap-3 lg:gap-6 py-2 px-2 border lg:border-none border-gray-200 dark:border-gray-800 rounded-lg ">
						{NAV_LINKS.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={`dark:hover:text-primary hover:text-primary font-medium transition ${
									isActiveLink(pathname, link.href)
										? "text-primary"
										: "text-gray-700 dark:text-gray-300"
								}`}
							>
								{link.label}
							</Link>
						))}
						{isAuthenticated && (
							<Link
								href="/dashboard"
								className={`dark:hover:text-primary hover:text-primary font-medium transition ${
									isActiveLink(pathname, "/dashboard")
										? "text-primary"
										: "text-gray-700 dark:text-gray-300"
								}`}
							>
								Dashboard
							</Link>
						)}
					</nav>

					{/* Desktop Actions */}
					<div className="hidden md:flex items-center gap-3">
						<button
							onClick={toggleTheme}
							className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
							aria-label="Toggle theme"
						>
							{theme === "dark" ? (
								<Sun className="w-5 h-5 text-yellow-500" />
							) : (
								<Moon className="w-5 h-5 text-gray-600" />
							)}
						</button>

						{isAuthenticated ? (
							<>
								<Link
									href="/chat"
									className="flex items-center gap-2 px-4 py-1.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
								>
									<MessageSquarePlus className="w-4 h-4" />
									Chat
								</Link>
								<LogoutButton size="lg" />
							</>
						) : (
							<>
								<Link
									href="/auth/login"
									className="px-4 py-1.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium rounded-lg"
								>
									Login
								</Link>
								<Link
									href="/auth/signup"
									className="px-4 py-1.5 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg shadow-primary/25 transition"
								>
									Sign Up
								</Link>
							</>
						)}
					</div>

					{/* Mobile Actions */}
					<div className="md:hidden flex items-center gap-2">
						<button
							onClick={toggleTheme}
							className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
							aria-label="Toggle theme"
						>
							{theme === "dark" ? (
								<Sun className="w-5 h-5 text-yellow-500" />
							) : (
								<Moon className="w-5 h-5 text-gray-600" />
							)}
						</button>

						<Sheet open={isOpen} onOpenChange={setIsOpen}>
							<button
								onClick={() => setIsOpen(!isOpen)}
								className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
								aria-label="Toggle menu"
							>
								{isOpen ? (
									<X className="w-6 h-6 text-gray-900 dark:text-white" />
								) : (
									<Menu className="w-6 h-6 text-gray-900 dark:text-white" />
								)}
							</button>

							<SheetContent
								side="left"
								showCloseButton
								className="w-3/4 sm:w-1/2"
							>
								<SheetHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
									<Link
										href="/"
										onClick={() => setIsOpen(false)}
										className="hover:opacity-80 transition"
									>
										<Logo />
									</Link>
									<p className="text-sm text-gray-500 dark:text-gray-400 font-bold mt-2">
										{isAuthenticated
											? `Welcome, ${user?.email?.split("@")[0]}!`
											: "Welcome to ChatAI!"}
									</p>
								</SheetHeader>
								<nav className="flex flex-col gap-2 px-2">
									{NAV_LINKS.map((link) => (
										<Link
											key={link.href}
											href={link.href}
											className={`px-4 py-2 font-medium hover:primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition inline-flex items-center gap-2 ${isActiveLink(pathname, link.href) ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
											onClick={() => setIsOpen(false)}
										>
											{link.Icon && <link.Icon className="w-5 h-5" />}
											{link.label}
										</Link>
									))}
									<Link
										href="/dashboard"
										className={`px-4 py-2 font-medium hover:primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition inline-flex items-center gap-2 ${isActiveLink(pathname, "/dashboard") ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
										onClick={() => setIsOpen(false)}
									>
										<LayoutDashboard className="w-5 h-5" />
										Dashboard
									</Link>
								</nav>

								<SheetFooter className="flex flex-col gap-2">
									{isAuthenticated ? (
										<>
											<Link
												href="/chat"
												className="flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
												onClick={() => setIsOpen(false)}
											>
												<MessageSquarePlus className="w-4 h-4" />
												Go to Chat
											</Link>
											<LogoutButton size="lg" />
										</>
									) : (
										<>
											<Link
												href="/auth/login"
												className="px-4 py-1.5 text-center text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
												onClick={() => setIsOpen(false)}
											>
												Login
											</Link>
											<Link
												href="/auth/signup"
												className="px-4 py-1.5 text-center text-lg font-semibold bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
												onClick={() => setIsOpen(false)}
											>
												Sign Up
											</Link>
										</>
									)}
								</SheetFooter>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</motion.header>
	);
}
