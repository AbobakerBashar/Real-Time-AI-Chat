import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Eye, Moon, Sun } from "lucide-react";
import { useTheme } from "../common/ThemeProvider";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface AppearanceSectionProps {
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

const AppearanceSection = ({
	settings,
	setSettings,
}: AppearanceSectionProps) => {
	const { theme, toggleTheme } = useTheme();

	const handleToggleSetting = (key: keyof typeof settings) => {
		setSettings((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	return (
		<motion.div variants={itemVariants}>
			<Card className="pt-0">
				<CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white py-1">
						Appearance
					</h2>
				</CardHeader>
				<CardContent className="pt-6 space-y-4">
					{/* Theme */}
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
						<div className="flex items-center gap-3">
							{theme === "light" ? (
								<Sun className="w-5 h-5 text-yellow-500" />
							) : (
								<Moon className="w-5 h-5 text-indigo-400" />
							)}
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Theme
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{theme === "light" ? "Light Mode" : "Dark Mode"}
								</p>
							</div>
						</div>
						<Button variant="outline" size="sm" onClick={toggleTheme}>
							{theme === "light" ? "Dark" : "Light"}
						</Button>
					</div>

					{/* Compact Mode */}
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
						<div className="flex items-center gap-3">
							<Eye className="w-5 h-5 text-blue-500" />
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Compact Mode
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Reduce spacing and make UI more compact
								</p>
							</div>
						</div>
						<button
							onClick={() => handleToggleSetting("compactMode")}
							className={`relative w-12 h-6 rounded-full transition-colors ${
								settings.compactMode
									? "bg-indigo-600"
									: "bg-gray-300 dark:bg-gray-700"
							}`}
						>
							<motion.div
								animate={{ x: settings.compactMode ? 24 : 2 }}
								className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
							/>
						</button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default AppearanceSection;
