"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useSignIn } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const formVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
		},
	},
};

const inputFieldVariants = {
	hidden: { opacity: 0, y: 10 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			delay: 0.2 + i * 0.1,
		},
	}),
	focus: {
		x: 4,
		transition: { duration: 0.2 },
	},
};

const buttonVariants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.5,
			delay: 0.5,
		},
	},
	hover: {
		scale: 1.02,
		transition: { duration: 0.2 },
	},
	tap: { scale: 0.98 },
};

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const { data: user, isLoading, error } = useCurrentUser();
	const { mutateAsync: signIn, isPending: isSigningIn } = useSignIn();

	useEffect(() => {
		if (isLoading || error) return;
		if (user) {
			router.push("/chat");
		}
	}, [user, isLoading, error, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await signIn({
			email,
			password,
		});
	};

	return (
		<motion.div
			variants={formVariants}
			initial="hidden"
			animate="visible"
			className="space-y-8"
		>
			{/* Header */}
			<div className="text-center">
				<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
					Welcome Back
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Sign in to your account to continue chatting with AI
				</p>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="space-y-5">
				{/* Email Field */}
				<motion.div
					custom={0}
					variants={inputFieldVariants}
					initial="hidden"
					animate="visible"
					className="space-y-2"
				>
					<Label htmlFor="email">Email Address</Label>
					<Input
						id="email"
						type="email"
						placeholder="you@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</motion.div>

				{/* Password Field */}
				<motion.div
					custom={1}
					variants={inputFieldVariants}
					initial="hidden"
					animate="visible"
					className="space-y-2"
				>
					<div className="flex items-center justify-between">
						<Label htmlFor="password">Password</Label>
						<Link
							href="/auth/forgot-password"
							className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
						>
							Forgot?
						</Link>
					</div>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</motion.div>

				{/* Submit Button */}
				<motion.div
					variants={buttonVariants}
					initial="hidden"
					animate="visible"
				>
					<Button
						type="submit"
						disabled={isSigningIn}
						className="w-full bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white font-semibold h-10"
					>
						{isSigningIn ? (
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
								className="relative"
							>
								<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
							</motion.div>
						) : (
							<div className="flex items-center justify-center gap-2">
								Sign In
								<ArrowRight className="w-5 h-5" />
							</div>
						)}
					</Button>
				</motion.div>
			</form>

			{/* Divider */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4, duration: 0.5 }}
				className="relative"
			>
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-gray-300 dark:border-gray-600" />
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="px-2 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400">
						Or continue with
					</span>
				</div>
			</motion.div>

			{/* Social Buttons */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5, duration: 0.5 }}
				className="grid grid-cols-2 gap-4"
			>
				<Button variant="outline" className="w-full" type="button">
					Google
				</Button>
				<Button variant="outline" className="w-full" type="button">
					GitHub
				</Button>
			</motion.div>

			{/* Sign Up Link */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.6, duration: 0.5 }}
				className="text-center"
			>
				<p className="text-gray-600 dark:text-gray-400">
					Don&apos;t have an account?{" "}
					<Link
						href="/auth/signup"
						className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
					>
						Sign Up
					</Link>
				</p>
			</motion.div>
		</motion.div>
	);
}
