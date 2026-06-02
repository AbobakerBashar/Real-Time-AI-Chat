"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AddMemberBtn from "./AddMemberBtn";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface ManageRoomHeaderProps {
	isGroupChat: boolean;
	role?: "admin" | "member" | "owner";
	roomId: string;
}

const ManageRoomHeader = ({
	isGroupChat,
	role,
	roomId,
}: ManageRoomHeaderProps) => {
	const router = useRouter();

	return (
		<motion.div
			variants={itemVariants}
			initial="hidden"
			animate="visible"
			className="mb-6"
		>
			<Button variant="outline" onClick={() => router.back()}>
				<ArrowLeft className="w-5 h-5" />
				Back
			</Button>
			<div className="flex justify-between gap-4 items-start mt-4">
				<div>
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
						Manage Room
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						{isGroupChat
							? "Manage group chat settings and members"
							: "Manage chat settings"}
					</p>
				</div>
				{role === "owner" ||
					(role === "admin" && (
						<AddMemberBtn roomId={roomId} size="lg">
							Add Member
						</AddMemberBtn>
					))}
			</div>
		</motion.div>
	);
};

export default ManageRoomHeader;
