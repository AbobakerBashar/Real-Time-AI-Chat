"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { FileImage, ShieldCheck, UserRoundCog, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface Capability {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	action: string;
}

const memberCapabilities: Capability[] = [
	{ icon: FileImage, label: "View shared media/files", action: "viewMedia" },
];

const ownerCapabilities: Capability[] = [
	{
		icon: ShieldCheck,
		label: "Promote/demote admins",
		action: "promoteAdmins",
	},
	{
		icon: UserRoundCog,
		label: "Transfer ownership",
		action: "transferOwnership",
	},
];

interface RoomPermissionsOverviewProps {
	isOwner?: boolean;
}

const RoomPermissionsOverview = ({ isOwner }: RoomPermissionsOverviewProps) => {
	const router = useRouter();
	const [notificationsMuted, setNotificationsMuted] = useState(false);
	const [newNickname, setNewNickname] = useState("");
	const [showNicknameForm, setShowNicknameForm] = useState(false);
	const [showAddMembersForm, setShowAddMembersForm] = useState(false);
	const [showRemoveMembersForm, setShowRemoveMembersForm] = useState(false);
	const [showPromoteAdminsForm, setShowPromoteAdminsForm] = useState(false);
	const [showTransferOwnershipForm, setShowTransferOwnershipForm] =
		useState(false);
	const [showPermissionsForm, setShowPermissionsForm] = useState(false);
	const [newMemberEmail, setNewMemberEmail] = useState("");
	const [selectedMember, setSelectedMember] = useState("");
	const [selectedAdmin, setSelectedAdmin] = useState("");
	const [newOwnerEmail, setNewOwnerEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Member Actions
	const handleViewRoomInfo = () => {
		toast.info("Room information panel opened");
		// Scroll to room info section
		document.querySelector('[data-section="room-info"]')?.scrollIntoView({
			behavior: "smooth",
		});
	};

	const handleViewMembers = () => {
		toast.info("Members list displayed");
	};

	const handleLeaveRoom = async () => {
		if (
			!confirm(
				"Are you sure you want to leave this room? This action cannot be undone.",
			)
		) {
			return;
		}

		setIsLoading(true);
		try {
			// API call to leave room
			// await leaveRoom(roomId);
			toast.success("You have left the room");
			router.push("/chat");
		} catch (error) {
			toast.error("Failed to leave room");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleToggleMuteNotifications = async () => {
		setIsLoading(true);
		try {
			// API call to toggle notifications
			// await toggleNotifications(roomId);
			setNotificationsMuted(!notificationsMuted);
			toast.success(
				`Notifications ${!notificationsMuted ? "muted" : "unmuted"}`,
			);
		} catch (error) {
			toast.error("Failed to toggle notifications");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChangeNickname = async () => {
		if (!newNickname.trim()) {
			toast.error("Nickname cannot be empty");
			return;
		}

		setIsLoading(true);
		try {
			// API call to change nickname
			// await changeNickname(roomId, newNickname);
			toast.success("Nickname updated successfully");
			setNewNickname("");
			setShowNicknameForm(false);
		} catch (error) {
			toast.error("Failed to change nickname");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleViewMedia = () => {
		toast.info("Shared media and files panel opened");
		// This would navigate to a media/files section
	};

	// Admin Actions
	const handleAddMembers = async () => {
		if (!newMemberEmail.trim()) {
			toast.error("Email cannot be empty");
			return;
		}

		setIsLoading(true);
		try {
			// API call to add member
			// await addMemberToRoom(roomId, newMemberEmail);
			toast.success("Member added successfully");
			setNewMemberEmail("");
			setShowAddMembersForm(false);
		} catch (error) {
			toast.error("Failed to add member");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRemoveMembers = async () => {
		if (!selectedMember) {
			toast.error("Please select a member");
			return;
		}

		if (!confirm("Are you sure you want to remove this member?")) {
			return;
		}

		setIsLoading(true);
		try {
			// API call to remove member
			// await removeMemberFromRoom(roomId, selectedMember);
			toast.success("Member removed successfully");
			setSelectedMember("");
			setShowRemoveMembersForm(false);
		} catch (error) {
			toast.error("Failed to remove member");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePromoteAdmins = async () => {
		if (!selectedAdmin) {
			toast.error("Please select a member");
			return;
		}

		setIsLoading(true);
		try {
			// API call to promote/demote admin
			// await toggleAdminStatus(roomId, selectedAdmin);
			toast.success("Admin status updated successfully");
			setSelectedAdmin("");
			setShowPromoteAdminsForm(false);
		} catch (error) {
			toast.error("Failed to update admin status");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleTransferOwnership = async () => {
		if (!newOwnerEmail.trim()) {
			toast.error("Email cannot be empty");
			return;
		}

		if (
			!confirm("Are you sure? You will no longer be the owner of this room.")
		) {
			return;
		}

		setIsLoading(true);
		try {
			// API call to transfer ownership
			// await transferOwnership(roomId, newOwnerEmail);
			toast.success("Ownership transferred successfully");
			setNewOwnerEmail("");
			setShowTransferOwnershipForm(false);
			router.refresh();
		} catch (error) {
			toast.error("Failed to transfer ownership");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleConfigurePermissions = () => {
		setShowPermissionsForm(!showPermissionsForm);
	};

	const handleActionClick = (action: string) => {
		switch (action) {
			case "viewInfo":
				handleViewRoomInfo();
				break;
			case "viewMembers":
				handleViewMembers();
				break;
			case "leaveRoom":
				handleLeaveRoom();
				break;
			case "muteNotifications":
				handleToggleMuteNotifications();
				break;
			case "changeNickname":
				setShowNicknameForm(!showNicknameForm);
				break;
			case "viewMedia":
				handleViewMedia();
				break;
			case "editName":
				toast.info("Use the Room Customization section to edit room name");
				break;
			case "changeAvatar":
				toast.info("Use the Room Customization section to change avatar");
				break;
			case "updateDescription":
				toast.info("Use the Room Customization section to update description");
				break;
			case "addMembers":
				setShowAddMembersForm(!showAddMembersForm);
				break;
			case "removeMembers":
				setShowRemoveMembersForm(!showRemoveMembersForm);
				break;
			case "promoteAdmins":
				setShowPromoteAdminsForm(!showPromoteAdminsForm);
				break;
			case "transferOwnership":
				setShowTransferOwnershipForm(!showTransferOwnershipForm);
				break;
			case "configurePermissions":
				handleConfigurePermissions();
				break;
			case "deleteRoom":
				toast.info("Use the Danger Zone section to delete the room");
				break;
			default:
				break;
		}
	};

	const ActionButton = ({
		capability,
		isAdmin,
	}: {
		capability: Capability;
		isAdmin: boolean;
	}) => {
		const Icon = capability.icon;
		const isActionDisabled = isAdmin && !isOwner;

		return (
			<div key={capability.action} className="flex flex-col gap-2">
				<Button
					variant="outline"
					className="w-full justify-start gap-3 h-auto py-2 text-left"
					onClick={() => handleActionClick(capability.action)}
					disabled={isActionDisabled || isLoading}
				>
					<Icon className="h-4 w-4 shrink-0" />
					<span>{capability.label}</span>
				</Button>

				{/* Action Forms */}
				{capability.action === "changeNickname" && showNicknameForm && (
					<div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-2">
						<Input
							placeholder="Enter new nickname"
							value={newNickname}
							onChange={(e) => setNewNickname(e.target.value)}
							className="text-sm"
						/>
						<div className="flex gap-2">
							<Button
								size="sm"
								onClick={handleChangeNickname}
								disabled={isLoading}
								className="flex-1"
							>
								{isLoading ? "Saving..." : "Save"}
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => setShowNicknameForm(false)}
								className="flex-1"
							>
								Cancel
							</Button>
						</div>
					</div>
				)}

				{capability.action === "addMembers" && showAddMembersForm && (
					<div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-2">
						<Input
							placeholder="Enter member email"
							value={newMemberEmail}
							onChange={(e) => setNewMemberEmail(e.target.value)}
							type="email"
							className="text-sm"
						/>
						<div className="flex gap-2">
							<Button
								size="sm"
								onClick={handleAddMembers}
								disabled={isLoading}
								className="flex-1"
							>
								{isLoading ? "Adding..." : "Add"}
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => setShowAddMembersForm(false)}
								className="flex-1"
							>
								Cancel
							</Button>
						</div>
					</div>
				)}

				{capability.action === "removeMembers" && showRemoveMembersForm && (
					<div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-2">
						<Label className="text-xs font-semibold">Select Member</Label>
						<Input
							placeholder="Member ID or email"
							value={selectedMember}
							onChange={(e) => setSelectedMember(e.target.value)}
							className="text-sm"
						/>
						<div className="flex gap-2">
							<Button
								size="sm"
								onClick={handleRemoveMembers}
								disabled={isLoading}
								className="flex-1 bg-red-600 hover:bg-red-700"
							>
								{isLoading ? "Removing..." : "Remove"}
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => setShowRemoveMembersForm(false)}
								className="flex-1"
							>
								Cancel
							</Button>
						</div>
					</div>
				)}

				{capability.action === "promoteAdmins" && showPromoteAdminsForm && (
					<div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-2">
						<Label className="text-xs font-semibold">Select Member</Label>
						<Input
							placeholder="Member ID or email"
							value={selectedAdmin}
							onChange={(e) => setSelectedAdmin(e.target.value)}
							className="text-sm"
						/>
						<div className="flex gap-2">
							<Button
								size="sm"
								onClick={handlePromoteAdmins}
								disabled={isLoading}
								className="flex-1"
							>
								{isLoading ? "Updating..." : "Update"}
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => setShowPromoteAdminsForm(false)}
								className="flex-1"
							>
								Cancel
							</Button>
						</div>
					</div>
				)}

				{capability.action === "transferOwnership" &&
					showTransferOwnershipForm && (
						<div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-2">
							<Input
								placeholder="New owner email"
								value={newOwnerEmail}
								onChange={(e) => setNewOwnerEmail(e.target.value)}
								type="email"
								className="text-sm"
							/>
							<div className="flex gap-2">
								<Button
									size="sm"
									onClick={handleTransferOwnership}
									disabled={isLoading}
									className="flex-1 bg-orange-600 hover:bg-orange-700"
								>
									{isLoading ? "Transferring..." : "Transfer"}
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => setShowTransferOwnershipForm(false)}
									className="flex-1"
								>
									Cancel
								</Button>
							</div>
						</div>
					)}

				{capability.action === "configurePermissions" &&
					showPermissionsForm && (
						<div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-3">
							<div className="space-y-2">
								<Label className="text-xs font-semibold">
									Permission Settings
								</Label>
								<div className="space-y-2">
									<label className="flex items-center gap-2 cursor-pointer">
										<input type="checkbox" defaultChecked className="rounded" />
										<span className="text-sm">
											Allow members to invite others
										</span>
									</label>
									<label className="flex items-center gap-2 cursor-pointer">
										<input type="checkbox" defaultChecked className="rounded" />
										<span className="text-sm">
											Allow members to view chat history
										</span>
									</label>
									<label className="flex items-center gap-2 cursor-pointer">
										<input type="checkbox" className="rounded" />
										<span className="text-sm">
											Allow members to pin messages
										</span>
									</label>
									<label className="flex items-center gap-2 cursor-pointer">
										<input type="checkbox" className="rounded" />
										<span className="text-sm">
											Require admin approval for new members
										</span>
									</label>
								</div>
							</div>
							<div className="flex gap-2">
								<Button
									size="sm"
									onClick={() => setShowPermissionsForm(false)}
									className="flex-1"
								>
									Save
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => setShowPermissionsForm(false)}
									className="flex-1"
								>
									Cancel
								</Button>
							</div>
						</div>
					)}
			</div>
		);
	};

	const getRoleLabel = () => {
		if (isOwner) {
			return "Owner/Admin Actions";
		}
		return "My Actions";
	};

	// Combine available actions based on user role
	const availableCapabilities: Capability[] = isOwner
		? [...memberCapabilities, ...ownerCapabilities]
		: memberCapabilities;

	return (
		<motion.div
			variants={itemVariants}
			initial="hidden"
			animate="visible"
			transition={{ delay: 0.2 }}
			className="mb-6"
		>
			<Card className="pt-0">
				<CardHeader
					className={`bg-linear-to-r py-2 ${
						isOwner
							? "from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900"
							: "from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900"
					}`}
				>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						{isOwner ? (
							<ShieldCheck className="w-6 h-6 text-blue-500" />
						) : (
							<Users className="w-6 h-6 text-emerald-500" />
						)}
						{getRoleLabel()}
					</h2>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="grid gap-3">
						{availableCapabilities.length > 0 ? (
							availableCapabilities.map((capability) => (
								<ActionButton
									key={capability.action}
									capability={capability}
									isAdmin={false}
								/>
							))
						) : (
							<p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
								No actions available
							</p>
						)}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default RoomPermissionsOverview;
