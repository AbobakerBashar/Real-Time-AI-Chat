"use client";

import { motion } from "framer-motion";

import AppearanceSection from "@/components/dashboard/AppearanceSection";
import SttingsNotificationsSection from "@/components/dashboard/SttingsNotificationsSection";
import PrivacySection from "@/components/dashboard/PrivacySection";
import AboutSection from "@/components/dashboard/AboutSection";
import { UserProfile } from "@/types/auth";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const SettingsComponent = ({ profile }: { profile: UserProfile | null }) => {
	const settings = {
		enable_notifications: profile?.enable_notifications ?? true,
		enable_sound_effects: profile?.enable_sound_effects ?? true,
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
			<AppearanceSection />

			{/* Notifications Section */}
			<SttingsNotificationsSection settings={settings} />

			{/* Privacy Section */}
			<PrivacySection
				show_last_seen={profile?.show_last_seen ?? true}
				show_online_status={profile?.show_online_status ?? true}
			/>

			{/* About Section */}
			<AboutSection />
		</motion.div>
	);
};

export default SettingsComponent;
