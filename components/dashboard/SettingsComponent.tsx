"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import AppearanceSection from "@/components/dashboard/AppearanceSection";
import SttingsNotificationsSection from "@/components/dashboard/SttingsNotificationsSection";
import PerformanceSection from "@/components/dashboard/PerformanceSection";
import PrivacySection from "@/components/dashboard/PrivacySection";
import SaveSettingsButton from "@/components/dashboard/SaveSettingsButton";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const SettingsComponent = () => {
	const [settings, setSettings] = useState({
		soundEnabled: true,
		notificationsEnabled: true,
		compactMode: false,
		autoSave: true,
		lowBandwidth: false,
	});

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
			<AppearanceSection settings={settings} setSettings={setSettings} />

			{/* Notifications Section */}
			<SttingsNotificationsSection
				settings={settings}
				setSettings={setSettings}
			/>

			{/* Performance Section */}
			<PerformanceSection settings={settings} setSettings={setSettings} />

			{/* Privacy Section */}
			<PrivacySection />

			{/* Save Button */}
			<SaveSettingsButton settings={settings} />
		</motion.div>
	);
};

export default SettingsComponent;
