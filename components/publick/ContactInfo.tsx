"use client";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

const contactInfo = [
	{
		icon: Mail,
		label: "Email",
		value: "hello@aichat.com",
		href: "mailto:hello@aichat.com",
	},
	{
		icon: Phone,
		label: "Phone",
		value: "+1 (555) 123-4567",
		href: "tel:+15551234567",
	},
	{
		icon: MapPin,
		label: "Location",
		value: "San Francisco, CA",
		href: "#",
	},
];

const contactInfoVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.6,
			delay: i * 0.1,
		},
	}),
};

const sectionTitleVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
		},
	},
};

const ContactInfo = () => {
	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true }}
			variants={{
				hidden: { opacity: 0 },
				visible: {
					opacity: 1,
					transition: { staggerChildren: 0.2 },
				},
			}}
		>
			<motion.h2
				variants={sectionTitleVariants}
				className="text-3xl font-bold text-gray-900 dark:text-white mb-8"
			>
				Contact Information
			</motion.h2>

			<div className="space-y-6">
				{contactInfo.map((info, index) => {
					const Icon = info.icon;
					return (
						<motion.a
							key={index}
							href={info.href}
							custom={index}
							variants={contactInfoVariants}
							className="flex items-start gap-4 group"
						>
							<div className="shrink-0">
								<div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition">
									<Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
								</div>
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
									{info.label}
								</h3>
								<p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition">
									{info.value}
								</p>
							</div>
						</motion.a>
					);
				})}
			</div>

			{/* Additional Info */}
			<motion.div
				variants={contactInfoVariants}
				custom={3}
				className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
			>
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
					Response Time
				</h3>
				<p className="text-gray-600 dark:text-gray-400">
					We typically respond to inquiries within 24 hours during business
					days.
				</p>
			</motion.div>
		</motion.div>
	);
};

export default ContactInfo;
