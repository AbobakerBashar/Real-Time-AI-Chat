"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDeleteAccount } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const DangerZone = () => {
	const [error, setError] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const { mutateAsync: deleteAccount, isPending: isDeletingAccount } =
		useDeleteAccount();

	const handleDeleteAccount = async () => {
		if (isDeletingAccount) return;
		try {
			await deleteAccount();
			setIsDeleting(false);
		} catch (err) {
			console.log("Error deleting account:", err);
			if (err instanceof Error) {
				setError(err.message || "Failed to delete account");
			} else {
				setError("Failed to delete account");
			}
		}
	};

	const onOpenChange = (open: boolean) => {
		setIsDeleting(open);
		setError(null);
	};

	return (
		<motion.div variants={itemVariants}>
			<Card className="border-red-200 dark:border-red-900/50">
				<CardContent className="pt-6 space-y-4">
					<div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50 dark:bg-red-900/10">
						<div>
							<h3 className="font-semibold text-red-900 dark:text-red-100">
								Delete Account
							</h3>
							<p className="text-sm text-red-800 dark:text-red-200">
								Permanently delete your account and all associated data
							</p>
						</div>
						<Button variant="destructive" onClick={() => setIsDeleting(true)}>
							Delete
						</Button>
					</div>
				</CardContent>
			</Card>
			{isDeleting && (
				<Dialog open={isDeleting} onOpenChange={onOpenChange}>
					<DialogContent className="max-w-md h-calc(100%-12rem)">
						<DialogHeader>
							<DialogTitle>Delete Account</DialogTitle>
							<DialogDescription>
								Permanently delete your account and all associated data. This
								action cannot be undone. Are you sure you want to proceed?
							</DialogDescription>
						</DialogHeader>
						<div className="grid grid-cols-2 gap-4">
							<Button
								variant="destructive"
								onClick={handleDeleteAccount}
								disabled={isDeletingAccount}
							>
								{isDeletingAccount ? "Deleting..." : "Yes, Delete My Account"}
							</Button>
							<Button
								variant="outline"
								onClick={() => {
									setError(null);
									setIsDeleting(false);
								}}
							>
								Cancel
							</Button>
						</div>
						{error && (
							<p className="text- text-red-600 dark:text-red-400 mt-4">
								{error}
							</p>
						)}
					</DialogContent>
				</Dialog>
			)}
		</motion.div>
	);
};

export default DangerZone;
