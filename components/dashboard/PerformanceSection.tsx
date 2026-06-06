import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Globe, Zap } from "lucide-react";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface PerformanceSectionProps {
	settings: {
		autoSave: boolean;
		lowBandwidth: boolean;
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

const PerformanceSection = ({
	settings,
	setSettings,
}: PerformanceSectionProps) => {
	const handleToggleSetting = (key: keyof typeof settings) => {
		setSettings((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	return (
		<motion.div variants={itemVariants}>
			<Card className="pt-0">
				<CardHeader className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 py-1">
						<Zap className="w-6 h-6" />
						Performance
					</h2>
				</CardHeader>
				<CardContent className="pt-6 space-y-4">
					{/* Auto Save */}
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
						<div className="flex items-center gap-3">
							<Zap className="w-5 h-5 text-yellow-500" />
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Auto Save
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Automatically save your messages as drafts
								</p>
							</div>
						</div>
						<button
							onClick={() => handleToggleSetting("autoSave")}
							className={`relative w-12 h-6 rounded-full transition-colors ${
								settings.autoSave
									? "bg-indigo-600"
									: "bg-gray-300 dark:bg-gray-700"
							}`}
						>
							<motion.div
								animate={{ x: settings.autoSave ? 24 : 2 }}
								className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
							/>
						</button>
					</div>

					{/* Low Bandwidth */}
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
						<div className="flex items-center gap-3">
							<Globe className="w-5 h-5 text-blue-500" />
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Low Bandwidth Mode
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Reduce data usage and improve performance
								</p>
							</div>
						</div>
						<button
							onClick={() => handleToggleSetting("lowBandwidth")}
							className={`relative w-12 h-6 rounded-full transition-colors ${
								settings.lowBandwidth
									? "bg-indigo-600"
									: "bg-gray-300 dark:bg-gray-700"
							}`}
						>
							<motion.div
								animate={{ x: settings.lowBandwidth ? 24 : 2 }}
								className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
							/>
						</button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default PerformanceSection;
