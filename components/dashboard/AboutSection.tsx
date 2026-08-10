"use client";

import { Info, FileText, Mail, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const AboutSection = () => {
	const appVersion = "1.0.0";

	return (
		<motion.div variants={itemVariants}>
			<Card className="pt-0">
				<CardHeader className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 py-1">
						<Info className="w-6 h-6" />
						About
					</h2>
				</CardHeader>
				<CardContent className="pt-6 space-y-4">
					{/* App Version */}
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
						<div className="flex items-center gap-3">
							<div className="w-3 h-3 rounded-full bg-green-500" />
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									App Version
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									{appVersion}
								</p>
							</div>
						</div>
					</div>

					{/* Terms of Service */}
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
						<div className="flex items-center gap-3">
							<FileText className="w-5 h-5 text-purple-500" />
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Terms of Service
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Review our terms and conditions
								</p>
							</div>
						</div>
						<Link href="/terms-of-service">
							<Button variant="outline" size="sm">
								Read
							</Button>
						</Link>
					</div>

					{/* Privacy Policy */}
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
						<div className="flex items-center gap-3">
							<Shield className="w-5 h-5 text-indigo-500" />
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Privacy Policy
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Learn about our data practices
								</p>
							</div>
						</div>
						<Link href="/privacy-policy">
							<Button variant="outline" size="sm">
								Read
							</Button>
						</Link>
					</div>

					{/* Contact & Support */}
					<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
						<div className="flex items-center gap-3">
							<Mail className="w-5 h-5 text-pink-500" />
							<div>
								<h3 className="font-semibold text-gray-900 dark:text-white">
									Contact & Support
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Get help or report an issue
								</p>
							</div>
						</div>
						<Link href="/contact">
							<Button variant="outline" size="sm">
								Contact
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default AboutSection;
