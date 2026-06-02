"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useState } from "react";
import ChatHeaderActions from "./ChatHeaderActions";
import ChatHeaderInfo from "./ChatHeaderInfo";
import Sidebar from "./Sidebar";
import { RoomDetails } from "@/types/rooms";

const headerVariants = {
	hidden: { opacity: 0, y: -20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
		},
	},
};

const Header = ({ roomDetails }: { roomDetails: RoomDetails | null }) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<motion.div
			variants={headerVariants}
			initial="hidden"
			animate="visible"
			className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 sm:py-4 transition-colors duration-300 h-auto sm:h-18 shrink-0"
		>
			<header className="max-w-4xl px-2 sm:px-4 md:px-6 flex items-center justify-between gap-2 sm:gap-4">
				{/* Mobile Menu Button */}
				<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
					<button
						className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors p-2 rounded-md"
						onClick={() => setIsMobileMenuOpen(true)}
						title="Open menu"
					>
						<Menu className="w-6 h-6" />
					</button>
					<SheetContent side="left" className="w-80 p-0">
						<Sidebar isMobile={true} />
					</SheetContent>
				</Sheet>

				<ChatHeaderInfo details={roomDetails} />

				<ChatHeaderActions />
			</header>
		</motion.div>
	);
};

export default Header;
