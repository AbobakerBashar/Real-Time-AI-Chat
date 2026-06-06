"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquarePlus } from "lucide-react";

const buttonVariants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: (i: number) => ({
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.5,
			delay: 0.5 + i * 0.1,
		},
	}),
	hover: {
		scale: 1.08,
		transition: { duration: 0.2 },
	},
	tap: { scale: 0.95 },
};

const GoToChat = ({ className }: { className?: string }) => {
	return (
		<motion.div
			className={className}
			variants={buttonVariants}
			initial="hidden"
			animate="visible"
			custom={0}
			whileHover="hover"
			whileTap="tap"
		>
			<Link
				href="/chat"
				className="flex items-center gap-2 px-6 py-2 bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/30 duration-300"
			>
				<MessageSquarePlus className="w-4 h-4" />
				Chat
			</Link>
		</motion.div>
	);
};

export default GoToChat;
