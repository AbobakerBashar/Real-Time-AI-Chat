"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import {
	Crown,
	Shield,
	User,
	Users,
	Trash2,
	ArrowUp,
	ArrowDown,
} from "lucide-react";
import { Member } from "@/types/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRemoveMemeber, useUpdateMemberRole } from "@/hooks/useRooms";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const getRoleIcon = (role: string) => {
	switch (role) {
		case "owner":
			return <Crown className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
		case "admin":
			return <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
		default:
			return <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
	}
};

interface MembersListSectionProps {
	isGroupChat?: boolean;
	roomId: string;
	members: Member[];
	currentUserRole?: "owner" | "admin" | "member";
	currentUserId?: string;
}

const MembersListSection = ({
	isGroupChat,
	members,
	roomId,
	currentUserRole,
	currentUserId,
}: MembersListSectionProps) => {
	const [memberId, setMememberId] = useState("");
	const { mutateAsync: removeMemeber, isPending: isRemoving } =
		useRemoveMemeber();
	const { mutateAsync: updateMemberRole, isPending: isUpdatingRole } =
		useUpdateMemberRole();

	const isAmin = currentUserRole === "admin";
	const isOwner = currentUserRole === "owner";

	const handlePromoteMember = async (memberId: string) => {
		if (isUpdatingRole || isRemoving) return;
		await updateMemberRole({ roomId, userId: memberId, role: "admin" });
	};

	const handleDemoteMember = async (memberId: string) => {
		if (isRemoving || isUpdatingRole) return;
		await updateMemberRole({ roomId, userId: memberId, role: "member" });
	};

	const handleRemoveMember = async (memberId: string) => {
		if (isRemoving) return;
		await removeMemeber({ roomId, userId: memberId });
	};

	const getRoleLabel = (role: string) => {
		return role.charAt(0).toUpperCase() + role.slice(1);
	};

	if (!isGroupChat) {
		return null;
	}

	return (
		<motion.div
			variants={itemVariants}
			initial="hidden"
			animate="visible"
			transition={{ delay: 0.25 }}
			className="mb-6"
		>
			<Card className="pt-0">
				<CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 py-2">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						<Users className="w-6 h-6 text-purple-500" />
						Members ({members.length})
					</h2>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="space-y-2">
						{members.length === 0 ? (
							<p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
								No members found
							</p>
						) : (
							members.map((member) => (
								<motion.div
									key={member.id}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
								>
									<div className="flex items-center gap-3 flex-1 min-w-0">
										{/* Avatar */}
										<Avatar className="h-10 w-10">
											{member.avatar_url && (
												<AvatarImage
													src={member.avatar_url}
													className="h-full w-full object-cover"
												/>
											)}
											<AvatarFallback>
												{(member.full_name || member.username || "U").charAt(0)}
											</AvatarFallback>
										</Avatar>

										{/* Member Info */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<p className="font-medium text-gray-900 dark:text-white truncate">
													{member.id === currentUserId
														? "You"
														: member.full_name || member.username || "Member"}
												</p>
												<div className="flex items-center gap-1 shrink-0">
													{getRoleIcon(member.role || "member")}
													<span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
														{getRoleLabel(member.role || "member")}
													</span>
												</div>
											</div>

											<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
												Joined{" "}
												{member.joined_at &&
													new Date(member.joined_at).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "numeric",
															year: "numeric",
														},
													)}
											</p>
										</div>
									</div>

									{/* Action Buttons */}
									{member.role !== "owner" &&
										member.id !== currentUserId &&
										(isAmin || isOwner) && (
											<div className="flex items-center gap-1 shrink-0">
												{member.role === "admin" && isOwner ? (
													<Button
														size="sm"
														variant="ghost"
														onClick={() => {
															setMememberId(member.id);
															handleDemoteMember(member.id);
														}}
														disabled={isRemoving || isUpdatingRole}
														title="Demote to member"
														className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950/30"
													>
														{isUpdatingRole && member.id === memberId ? (
															"Demoting..."
														) : (
															<>
																<ArrowDown className="w-4 h-4" />{" "}
																<span className="hidden md:inline">Demote</span>
															</>
														)}
													</Button>
												) : (
													member.role === "member" && (
														<Button
															size="sm"
															variant="ghost"
															onClick={() => {
																setMememberId(member.id);
																handlePromoteMember(member.id);
															}}
															disabled={isUpdatingRole || isRemoving}
															title="Promote to admin"
															className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30"
														>
															{isUpdatingRole && member.id === memberId ? (
																"Promoting..."
															) : (
																<>
																	<ArrowUp className="w-4 h-4" />{" "}
																	<span className="hidden md:inline">
																		Promote
																	</span>
																</>
															)}
														</Button>
													)
												)}
												{isOwner ? (
													<Button
														size="sm"
														variant="ghost"
														onClick={() => {
															setMememberId(member.id);
															handleRemoveMember(member.id);
														}}
														disabled={isRemoving || isUpdatingRole}
														title="Remove member"
														className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
													>
														{isRemoving && member.id === memberId ? (
															"Removing..."
														) : (
															<>
																<Trash2 className="w-4 h-4" />{" "}
																<span className="hidden md:inline">Remove</span>
															</>
														)}
													</Button>
												) : (
													isAmin &&
													member.role !== "admin" && (
														<Button
															size="sm"
															variant="ghost"
															onClick={() => {
																setMememberId(member.id);
																handleRemoveMember(member.id);
															}}
															disabled={isRemoving || isUpdatingRole}
															title="Remove member"
															className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
														>
															{isRemoving && member.id === memberId ? (
																"Removing..."
															) : (
																<>
																	<Trash2 className="w-4 h-4" />{" "}
																	<span className="hidden md:inline">
																		Remove
																	</span>
																</>
															)}
														</Button>
													)
												)}
											</div>
										)}
								</motion.div>
							))
						)}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default MembersListSection;
