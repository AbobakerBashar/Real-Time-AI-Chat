"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/common/ThemeProvider";
import { motion } from "framer-motion";
import { Moon, Sun, Volume2, Eye, Lock, Zap, Globe, Bell } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SettingsPage() {
	const { theme, toggleTheme } = useTheme();
	const [settings, setSettings] = useState({
		soundEnabled: true,
		notificationsEnabled: true,
		compactMode: false,
		autoSave: true,
		lowBandwidth: false,
	});

	const handleToggleSetting = (key: keyof typeof settings) => {
		setSettings((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const handleSaveSettings = () => {
		// Save settings to localStorage or backend
		localStorage.setItem("appSettings", JSON.stringify(settings));
		toast.success("Settings saved successfully!");
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-6"
		>
			{/* Header */}
			<motion.div variants={itemVariants}>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Settings
				</h1>
				<p className="text-gray-600 dark:text-gray-400 mt-1">
					Customize your app experience
				</p>
			</motion.div>

			{/* Appearance Section */}
			<motion.div variants={itemVariants}>
				<Card>
					<CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
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

			{/* Notifications Section */}
			<motion.div variants={itemVariants}>
				<Card>
					<CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
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

			{/* Performance Section */}
			<motion.div variants={itemVariants}>
				<Card>
					<CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
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

			{/* Privacy Section */}
			<motion.div variants={itemVariants}>
				<Card>
					<CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
							<Lock className="w-6 h-6" />
							Privacy
						</h2>
					</CardHeader>
					<CardContent className="pt-6 space-y-4">
						<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Privacy Policy
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Review our privacy policy
								</p>
							</div>
							<Button variant="outline" size="sm">
								Read
							</Button>
						</div>
						<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Data & Privacy
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Manage your data and privacy settings
								</p>
							</div>
							<Button variant="outline" size="sm">
								Manage
							</Button>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Save Button */}
			<motion.div variants={itemVariants} className="flex gap-2">
				<Button
					onClick={handleSaveSettings}
					size="lg"
					className="flex-1 md:flex-none"
				>
					Save Settings
				</Button>
				<Button variant="outline" size="lg">
					Reset to Defaults
				</Button>
			</motion.div>
		</motion.div>
	);
}
