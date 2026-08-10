import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../common/ThemeProvider";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const AppearanceSection = () => {
	const { theme, toggleTheme } = useTheme();

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
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default AppearanceSection;
