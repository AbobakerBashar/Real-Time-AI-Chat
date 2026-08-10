"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUpdateUserProfile } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface PrivacySectionProps {
	show_online_status: boolean;
	show_last_seen: boolean;
}

const PrivacySection = ({
	show_online_status,
	show_last_seen,
}: PrivacySectionProps) => {
	const [error, setError] = useState<string | null>(null);
	const [isTogglingShowOnlineStatus, setIsTogglingShowOnlineStatus] =
		useState(false);
	const [isTogglingShowLastSeen, setIsTogglingShowLastSeen] = useState(false);

	const { mutateAsync: updateStatus, isPending: isUpdatingStatus } =
		useUpdateUserProfile();

	// Update last seen on mount and every minute
	useEffect(() => {
		const initial = async () => {
			setError(null);

			try {
				await updateStatus({
					last_seen: new Date(),
				});
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to update status",
				);
			}
		};
		initial();

		const interval = setInterval(async () => {
			setError(null);

			try {
				await updateStatus({
					last_seen: new Date(),
				});
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to update status",
				);
			}
		}, 60000);

		return () => clearInterval(interval);
	}, [updateStatus]);

	const toggleOnlineStatus = async () => {
		if (isUpdatingStatus) return;
		setError(null);
		setIsTogglingShowOnlineStatus(true);

		try {
			await updateStatus({
				show_online_status: !show_online_status,
			});
		} catch (error) {
			setError(
				error instanceof Error ? error.message : "Failed to update status",
			);
		} finally {
			setIsTogglingShowOnlineStatus(false);
		}
	};

	const toggleShowLastSeen = async () => {
		if (isUpdatingStatus) return;

		setError(null);
		setIsTogglingShowLastSeen(true);
		try {
			await updateStatus({
				show_last_seen: !show_last_seen,
			});
		} catch (error) {
			setError(
				error instanceof Error ? error.message : "Failed to update status",
			);
		} finally {
			setIsTogglingShowLastSeen(false);
		}
	};

	return (
		<motion.div variants={itemVariants}>
			<Card className="pt-0">
				<CardHeader className="bg-linear-to-r from-red-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 py-1">
						<Lock className="w-6 h-6" />
						Privacy
					</h2>
				</CardHeader>
				<CardContent className="pt-6 space-y-4">
					{/* Show Online Status */}
					{error && (
						<div className="p-3 bg-red-100 text-red-700 rounded-md">
							{error}
						</div>
					)}
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
						<div className="flex items-center gap-3">
							<Eye className="w-5 h-5 text-green-500" />
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Show Online Status
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Let others see when you&apos;re online
								</p>
							</div>
						</div>
						{isTogglingShowOnlineStatus ? (
							<Loader className="w-4 h-4 animate-spin text-primary" />
						) : (
							<button
								onClick={toggleOnlineStatus}
								disabled={isUpdatingStatus}
								className={`relative w-12 h-6 rounded-full transition-colors ${
									show_online_status
										? "bg-indigo-600"
										: "bg-gray-300 dark:bg-gray-700"
								}`}
							>
								<motion.div
									animate={{ x: show_online_status ? 24 : 2 }}
									className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
								/>
							</button>
						)}
					</div>

					{/* Show Last Seen */}
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
						<div className="flex items-center gap-3">
							<EyeOff className="w-5 h-5 text-amber-500" />
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Show Last Seen
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Let others see your last activity time
								</p>
							</div>
						</div>

						{isTogglingShowLastSeen ? (
							<Loader className="w-4 h-4 animate-spin text-primary" />
						) : (
							<button
								onClick={toggleShowLastSeen}
								disabled={isUpdatingStatus}
								className={`relative w-12 h-6 rounded-full transition-colors ${
									show_last_seen
										? "bg-indigo-600"
										: "bg-gray-300 dark:bg-gray-700"
								}`}
							>
								<motion.div
									animate={{ x: show_last_seen ? 24 : 2 }}
									className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
								/>
							</button>
						)}
					</div>

					{/* Privacy Policy */}
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
						<div>
							<h3 className="font-semibold text-gray-900 dark:text-white">
								Privacy Policy
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Review our privacy policy
							</p>
						</div>
						<Link href="/privacy-policy">
							<Button variant="outline" size="sm">
								Read
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default PrivacySection;
