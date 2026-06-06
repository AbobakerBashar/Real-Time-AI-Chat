import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const PrivacySection = () => {
	return (
		<motion.div variants={itemVariants}>
			<Card className="pt-0">
				<CardHeader className="bg-linear-to-r from-red-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 py-1">
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
	);
};

export default PrivacySection;
