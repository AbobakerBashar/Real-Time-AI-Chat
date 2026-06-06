"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const DangerZone = () => {
	return (
		<motion.div variants={itemVariants}>
			<Card className="border-red-200 dark:border-red-900/50">
				<CardContent className="pt-6 space-y-4">
					<div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50 dark:bg-red-900/10">
						<div>
							<h3 className="font-semibold text-red-900 dark:text-red-100">
								Delete Account
							</h3>
							<p className="text-sm text-red-800 dark:text-red-200">
								Permanently delete your account and all associated data
							</p>
						</div>
						<Button variant="destructive">Delete</Button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default DangerZone;
