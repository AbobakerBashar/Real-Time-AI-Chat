import { motion } from "framer-motion";
import { Bell, Loader, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useUpdateUserProfile } from "@/hooks/useAuth";
import { useState } from "react";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface NotificationsSectionProps {
	settings: {
		enable_sound_effects: boolean;
		enable_notifications: boolean;
	};
}

const SttingsNotificationsSection = ({
	settings,
}: NotificationsSectionProps) => {
	const [error, setError] = useState<string | null>(null);
	const [isTogglingSound, setIsTogglingSound] = useState(false);
	const [isTogglingNotifications, setIsTogglingNotifications] = useState(false);

	const { mutateAsync: updateStatus, isPending: isUpdatingStatus } =
		useUpdateUserProfile();

	const handleToggleSetting = async (
		settingKey: "enable_notifications" | "enable_sound_effects",
	) => {
		if (isUpdatingStatus) return;

		if (settingKey === "enable_sound_effects") {
			setIsTogglingSound(true);
		} else {
			setIsTogglingNotifications(true);
		}

		setError(null);
		const newValue = !settings[settingKey];

		try {
			await updateStatus({ [settingKey]: newValue });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update status");
		} finally {
			setIsTogglingSound(false);
			setIsTogglingNotifications(false);
		}
	};

	return (
		<motion.div variants={itemVariants}>
			<Card className="pt-0">
				<CardHeader className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 py-1">
						<Bell className="w-6 h-6" />
						Notifications
					</h2>
				</CardHeader>
				{error && (
					<div className="mx-4 bg-red-100 text-red-700 p-3 rounded-md">
						{error}
					</div>
				)}
				<CardContent className="pt-6 space-y-4">
					{/* Push Notifications */}
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
						<div className="flex items-center gap-3">
							<Bell className="w-5 h-5 text-orange-500" />
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Enable Notifications
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Receive notifications for new messages
								</p>
							</div>
						</div>
						{isTogglingNotifications ? (
							<Loader className="w-5 h-5 text-primary animate-spin" />
						) : (
							<button
								onClick={() => handleToggleSetting("enable_notifications")}
								disabled={isUpdatingStatus}
								className={`relative w-12 h-6 rounded-full transition-colors ${
									settings.enable_notifications
										? "bg-indigo-600"
										: "bg-gray-300 dark:bg-gray-700"
								}`}
							>
								<motion.div
									animate={{
										x: settings.enable_notifications ? 24 : 2,
									}}
									className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
								/>
							</button>
						)}
					</div>

					{/* Sound */}
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
						<div className="flex items-center gap-3">
							<Volume2 className="w-5 h-5 text-green-500" />
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Sound Effects
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Play sound for incoming messages
								</p>
							</div>
						</div>

						{isTogglingSound ? (
							<Loader className="w-5 h-5 text-primary animate-spin" />
						) : (
							<button
								onClick={() => handleToggleSetting("enable_sound_effects")}
								disabled={isUpdatingStatus}
								className={`relative w-12 h-6 rounded-full transition-colors ${
									settings.enable_sound_effects
										? "bg-indigo-600"
										: "bg-gray-300 dark:bg-gray-700"
								}`}
							>
								<motion.div
									animate={{ x: settings.enable_sound_effects ? 24 : 2 }}
									className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
								/>
							</button>
						)}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default SttingsNotificationsSection;
