"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const NotificationSettings = () => {
	return (
		<motion.div variants={itemVariants}>
			<Card>
				<CardHeader className="bg-linear-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
					<h2 className="text-lg font-bold text-gray-900 dark:text-white">
						Notification Preferences
					</h2>
				</CardHeader>
				<CardContent className="pt-6 space-y-4">
					<p className="text-sm text-gray-600 dark:text-gray-400">
						Go to Settings to customize which notifications you receive
					</p>
					<Button variant="outline" className="w-full md:w-auto">
						Go to Settings
					</Button>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default NotificationSettings;
