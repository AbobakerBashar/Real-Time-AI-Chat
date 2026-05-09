"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSignup } from "@/hooks/useAuth";
import { toast } from "sonner";

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
			delay: 0.7,
		},
	},
	hover: {
		scale: 1.02,
		transition: { duration: 0.2 },
	},
	tap: { scale: 0.98 },
};

export default function SignupPage() {
	const [fullName, setFullName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [agreed, setAgreed] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const { mutateAsync: signup, isPending: isSigningUp } = useSignup();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error("Passwords do not match!");
			return;
		}
		// Simulate API call
		const result = await signup({
			email,
			password,
			full_name: fullName,
			username,
		});
		if (result.success) {
			setIsSuccess(true);
		}
	};

	if (isSuccess) {
		return (
			<motion.div
				variants={formVariants}
				initial="hidden"
				animate="visible"
				className="space-y-8"
			>
				<div className="text-center">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
						Account Created Successfully!
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Please check your email for a verification link. Once verified, you
						can log in and start chatting with powerful AI!
					</p>
					<Link
						href="/auth/login"
						className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold mt-4 inline-block"
					>
						Go to Login
					</Link>
				</div>
			</motion.div>
		);
	}

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
					Create Account
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Join us and start chatting with powerful AI today
				</p>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="space-y-4">
				{/* Name Field */}
				<motion.div
					custom={0}
					variants={inputFieldVariants}
					initial="hidden"
					animate="visible"
					className="space-y-2"
				>
					<Label htmlFor="name">Full Name</Label>
					<Input
						id="name"
						type="text"
						placeholder="John Doe"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						required
					/>
				</motion.div>
				<motion.div
					custom={1}
					variants={inputFieldVariants}
					initial="hidden"
					animate="visible"
					className="space-y-2"
				>
					<Label htmlFor="username">Username</Label>
					<Input
						id="username"
						type="text"
						placeholder="john_doe"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</motion.div>

				{/* Email Field */}
				<motion.div
					custom={2}
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
					custom={3}
					variants={inputFieldVariants}
					initial="hidden"
					animate="visible"
					className="space-y-2"
				>
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</motion.div>

				{/* Confirm Password Field */}
				<motion.div
					custom={4}
					variants={inputFieldVariants}
					initial="hidden"
					animate="visible"
					className="space-y-2"
				>
					<Label htmlFor="confirmPassword">Confirm Password</Label>
					<Input
						id="confirmPassword"
						type="password"
						placeholder="••••••••"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</motion.div>

				{/* Terms & Conditions */}
				<motion.div
					custom={5}
					variants={inputFieldVariants}
					initial="hidden"
					animate="visible"
					className="flex items-start gap-3 pt-2"
				>
					<input
						id="terms"
						type="checkbox"
						checked={agreed}
						onChange={(e) => setAgreed(e.target.checked)}
						required
						className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
					/>
					<label
						htmlFor="terms"
						className="text-sm text-gray-600 dark:text-gray-400"
					>
						I agree to the{" "}
						<Link
							href="#"
							className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
						>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link
							href="#"
							className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
						>
							Privacy Policy
						</Link>
					</label>
				</motion.div>

				{/* Submit Button */}
				<motion.div
					variants={buttonVariants}
					initial="hidden"
					animate="visible"
					className="pt-4"
				>
					<Button
						type="submit"
						disabled={isSigningUp || !agreed}
						className="w-full bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white font-semibold h-10"
					>
						{isSigningUp ? (
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
								className="relative"
							>
								<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
							</motion.div>
						) : (
							<div className="flex items-center justify-center gap-2">
								Create Account
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
				transition={{ delay: 0.6, duration: 0.5 }}
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
				transition={{ delay: 0.7, duration: 0.5 }}
				className="grid grid-cols-2 gap-4"
			>
				<Button variant="outline" className="w-full" type="button">
					Google
				</Button>
				<Button variant="outline" className="w-full" type="button">
					GitHub
				</Button>
			</motion.div>

			{/* Sign In Link */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.8, duration: 0.5 }}
				className="text-center"
			>
				<p className="text-gray-600 dark:text-gray-400">
					Already have an account?{" "}
					<Link
						href="/auth/login"
						className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
					>
						Sign In
					</Link>
				</p>
			</motion.div>
		</motion.div>
	);
}
