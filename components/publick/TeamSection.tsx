"use client";

import { motion } from "framer-motion";

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

const teamMemberVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			delay: i * 0.1,
		},
	}),
	hover: {
		y: -5,
		transition: { duration: 0.3 },
	},
};

const team = [
	{
		name: "Sarah Chen",
		role: "Founder & CEO",
		bio: "AI researcher and entrepreneur",
	},
	{
		name: "Michael Park",
		role: "CTO & Co-founder",
		bio: "Full-stack engineer and tech lead",
	},
	{
		name: "Elena Rodriguez",
		role: "Head of Design",
		bio: "UX/UI specialist",
	},
	{
		name: "James Morrison",
		role: "Lead Developer",
		bio: "Backend systems expert",
	},
];

const TeamSection = () => {
	return (
		<section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				<motion.h2
					initial="hidden"
					whileInView="visible"
					variants={sectionTitleVariants}
					viewport={{ once: true }}
					className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center"
				>
					Our Team
				</motion.h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{team.map((member, index) => (
						<motion.div
							key={index}
							custom={index}
							initial="hidden"
							whileInView="visible"
							variants={teamMemberVariants}
							whileHover="hover"
							viewport={{ once: true }}
							className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700"
						>
							<div className="w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-blue-500 to-purple-600"></div>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
								{member.name}
							</h3>
							<p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">
								{member.role}
							</p>
							<p className="text-gray-600 dark:text-gray-400 text-sm">
								{member.bio}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default TeamSection;
