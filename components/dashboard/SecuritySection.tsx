"use client";

import { useState } from "react";

import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useChangePassword } from "@/hooks/useAuth";
import { Input } from "../ui/input";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const SecuritySection = () => {
	const [error, setError] = useState<string | null>(null);

	const [inputs, setInputs] = useState({
		currentPassword: "",
		newPassword: "",
		confirmNewPassword: "",
	});
	const [changingPassword, setChangingPassword] = useState(false);
	const { mutateAsync: changePassword, isPending: isChangingPassword } =
		useChangePassword();

	const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (isChangingPassword) return;

		setError(null);
		if (inputs.newPassword !== inputs.confirmNewPassword) {
			setError("New passwords do not match");
			return;
		}
		if (inputs.newPassword.length < 6) {
			setError("New password must be at least 6 characters");
			return;
		}

		try {
			await changePassword({
				currentPassword: inputs.currentPassword,
				newPassword: inputs.newPassword,
			});
			setChangingPassword(false);
			setInputs({
				currentPassword: "",
				newPassword: "",
				confirmNewPassword: "",
			});
		} catch (error) {
			console.error("Error changing password:", error);
			if (error instanceof Error) {
				setError(
					error.message === "Invalid login credentials"
						? "Current password is incorrect. Please try again."
						: error.message || "Failed to change password. Please try again.",
				);
			} else {
				setError("Failed to change password");
			}
		}
	};

	return (
		<motion.div variants={itemVariants}>
			<Card className="pt-0">
				<CardHeader className="bg-linear-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 py-1">
						<Shield className="w-6 h-6" />
						Security
					</h2>
				</CardHeader>
				<CardContent className="pt-6 space-y-4">
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg">
						{!changingPassword ? (
							<>
								<div>
									<h3 className="font-semibold text-gray-900 dark:text-white">
										Change Password
									</h3>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Update your password to keep your account secure
									</p>
								</div>
								<Button
									variant="outline"
									onClick={() => setChangingPassword(true)}
								>
									Change
								</Button>
							</>
						) : (
							<form
								className="w-full space-y-4"
								onSubmit={handleChangePassword}
							>
								<Input
									type="password"
									placeholder="Current Password"
									value={inputs.currentPassword}
									onChange={(e) =>
										setInputs({
											...inputs,
											currentPassword: e.target.value,
										})
									}
									required
								/>
								<Input
									type="password"
									placeholder="New Password"
									required
									value={inputs.newPassword}
									onChange={(e) =>
										setInputs({ ...inputs, newPassword: e.target.value })
									}
								/>
								<Input
									type="password"
									placeholder="Confirm New Password"
									required
									value={inputs.confirmNewPassword}
									onChange={(e) =>
										setInputs({ ...inputs, confirmNewPassword: e.target.value })
									}
								/>
								<div className="grid grid-cols-2 gap-4">
									<Button type="submit" disabled={isChangingPassword}>
										{isChangingPassword ? "Changing..." : "Save"}
									</Button>
									<Button
										type="button"
										variant="outline"
										disabled={isChangingPassword}
										onClick={() => setChangingPassword(false)}
									>
										Cancel
									</Button>
								</div>
							</form>
						)}
					</div>
					{error && (
						<p className="text- text-red-600 m-2 p-2 bg-red-50 dark:bg-red-800/10 border border-red-200 dark:border-red-700 rounded-lg">
							{error || "Failed to change password. Please try again."}
						</p>
					)}
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg">
						<div>
							<h3 className="font-semibold text-gray-900 dark:text-white">
								Two-Factor Authentication
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Add an extra layer of security to your account
							</p>
						</div>
						<Button variant="outline">Enable</Button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default SecuritySection;
