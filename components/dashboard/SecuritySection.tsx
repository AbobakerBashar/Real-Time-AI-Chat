"use client";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const SecuritySection = () => {
	return (
		<motion.div variants={itemVariants}>
			<Card className="pt-0">
				<CardHeader className="bg-linear-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 py-1">
						<Shield className="w-6 h-6" />
						Security
					</h2>
				</CardHeader>
				<CardContent className="pt-6 space-y-4">
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg">
						<div>
							<h3 className="font-semibold text-gray-900 dark:text-white">
								Change Password
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Update your password to keep your account secure
							</p>
						</div>
						<Button variant="outline">Change</Button>
					</div>
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg">
						<div>
							<h3 className="font-semibold text-gray-900 dark:text-white">
								Two-Factor Authentication
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Add an extra layer of security to your account
							</p>
						</div>
						<Button variant="outline">Enable</Button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default SecuritySection;
