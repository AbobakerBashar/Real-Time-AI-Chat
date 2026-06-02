"use client";

import { Button } from "@/components/ui/button";
import AddMemberModal from "./AddMemberModal";
import { useState } from "react";

interface AddMemberBtnProps {
	children?: React.ReactNode;
	className?: string;
	variant?: "outline" | "default" | "ghost" | "link";
	size?: "sm" | "lg" | "xs";
	roomId: string;
}

const AddMemberBtn = ({
	children,
	className,
	variant,
	size,
	roomId,
}: AddMemberBtnProps) => {
	const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

	return (
		<>
			<Button
				variant={variant}
				className={className}
				size={size}
				title="Add member to group"
				onClick={() => setIsAddMemberModalOpen(true)}
			>
				{children}
			</Button>
			<AddMemberModal
				isOpen={isAddMemberModalOpen}
				setIsAddMemberModalOpen={setIsAddMemberModalOpen}
				roomId={roomId}
			/>
		</>
	);
};

export default AddMemberBtn;
