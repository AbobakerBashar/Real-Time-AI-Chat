"use client";

import { motion } from "framer-motion";
import SidebarHeader from "./SidebarHeader";
import SearchBar from "./SearchBar";
import SidebarChatPanel from "./SidebarChatPanel";
import SidebarFooter from "./SidebarFooter";

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

export default function SidebarContain() {
	return (
		<motion.div
			variants={sidebarVariants}
			initial="hidden"
			animate="visible"
			className="h-full flex flex-col relative z-50"
		>
			{/* Header Section with Logo */}
			<SidebarHeader />
			{/* Search Bar */}
			<SearchBar />
			{/* Conversations List */}
			<SidebarChatPanel />
			{/* Footer Section */}
			<SidebarFooter />
		</motion.div>
	);
}
