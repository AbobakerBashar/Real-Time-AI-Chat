"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { useAddUserToGroup, useGetRoomDetails } from "@/hooks/useRooms";
import { Member } from "@/types/auth";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ChatHeaderActions from "./ChatHeaderActions";
import ChatHeaderInfo from "./ChatHeaderInfo";
import { SelectUserDialog } from "./SelectUserDialog";
import Sidebar from "./Sidebar";

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

const Header = ({ roomId }: { roomId: string }) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

	const { data: details, isLoading: isLoadingDetails } =
		useGetRoomDetails(roomId);

	const { mutateAsync: addUserToGroup, isPending: isAddingMember } =
		useAddUserToGroup();

	const handleAddMember = async (userId: string) => {
		await addUserToGroup({ roomId, userId });
	};

	return (
		<motion.div
			variants={headerVariants}
			initial="hidden"
			animate="visible"
			className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 sm:p-4 transition-colors duration-300 h-auto sm:h-18 shrink-0"
		>
			<header className="max-w-4xl px-2 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
				{/* Mobile Menu Button */}
				<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
					<Button
						variant="ghost"
						size="sm"
						className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						onClick={() => setIsMobileMenuOpen(true)}
						title="Open menu"
					>
						<Menu className="w-5 h-5" />
					</Button>
					<SheetContent side="left" className="w-80 p-0">
						<SheetClose className="absolute top-2 right-2 z-50">
							<X className="w-5 h-5" />
						</SheetClose>
						<Sidebar isMobile={true} />
					</SheetContent>
				</Sheet>

				<ChatHeaderInfo
					setIsInviteDialogOpen={setIsInviteDialogOpen}
					isLoading={isLoadingDetails}
					details={details}
					isAddingMember={isAddingMember}
					roomId={roomId}
				/>

				<ChatHeaderActions />
			</header>
			<SelectUserDialog
				isOpen={isInviteDialogOpen}
				onClose={() => setIsInviteDialogOpen(false)}
				type="group"
				onSelect={handleAddMember}
				isLoading={isAddingMember}
				existingMembers={details?.members as Member[] | undefined}
			/>
		</motion.div>
	);
};

export default Header;
