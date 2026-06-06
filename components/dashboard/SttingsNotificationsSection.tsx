import { motion } from "framer-motion";
import { Bell, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface NotificationsSectionProps {
	settings: {
		autoSave: boolean;
		lowBandwidth: boolean;
		compactMode: boolean;
		soundEnabled: boolean;
		notificationsEnabled: boolean;
	};
	setSettings: React.Dispatch<
		React.SetStateAction<{
			autoSave: boolean;
			lowBandwidth: boolean;
			compactMode: boolean;
			soundEnabled: boolean;
			notificationsEnabled: boolean;
		}>
	>;
}

const SttingsNotificationsSection = ({
	settings,
	setSettings,
}: NotificationsSectionProps) => {
	const handleToggleSetting = (key: keyof typeof settings) => {
		setSettings((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
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
						<button
							onClick={() => handleToggleSetting("notificationsEnabled")}
							className={`relative w-12 h-6 rounded-full transition-colors ${
								settings.notificationsEnabled
									? "bg-indigo-600"
									: "bg-gray-300 dark:bg-gray-700"
							}`}
						>
							<motion.div
								animate={{
									x: settings.notificationsEnabled ? 24 : 2,
								}}
								className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
							/>
						</button>
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
						<button
							onClick={() => handleToggleSetting("soundEnabled")}
							className={`relative w-12 h-6 rounded-full transition-colors ${
								settings.soundEnabled
									? "bg-indigo-600"
									: "bg-gray-300 dark:bg-gray-700"
							}`}
						>
							<motion.div
								animate={{ x: settings.soundEnabled ? 24 : 2 }}
								className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
							/>
						</button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default SttingsNotificationsSection;
