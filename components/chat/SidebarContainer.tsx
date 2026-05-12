"use client";

import { motion } from "framer-motion";

const sidebarVariants = {
	hidden: { x: -300, opacity: 0 },
	visible: {
		x: 0,
		opacity: 1,
		transition: {
			duration: 0.4,
		},
	},
};

const SidebarContainer = ({ children }: { children: React.ReactNode }) => {
	return (
		<motion.div
			variants={sidebarVariants}
			initial="hidden"
			animate="visible"
			className="h-full flex flex-col relative z-50"
		>
			{children}
		</motion.div>
	);
};

export default SidebarContainer;
