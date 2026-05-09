"use client";

import { Button } from "@/components/ui/button";

import { useCurrentUser, useUserList } from "@/hooks/useAuth";
import Image from "next/image";

export interface SelectionDialogProps {
	isOpen: boolean;
	onClose: () => void;
	type: "person" | "group";
	onSelect: (userId: string, userName: string) => void;
	isLoading: boolean;
}

export const SelectUserDialog = ({
	isOpen,
	onClose,
	type,
	onSelect,
	isLoading,
}: SelectionDialogProps) => {
	const { data: currentUser, isLoading: isCurrentUserLoading } =
		useCurrentUser();

	const { data: users, isLoading: isLoadingUsers } = useUserList();

	if (isCurrentUserLoading && isOpen) {
		return (
			<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity opacity-100">
				<div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-96 max-h-80 flex flex-col shadow-lg">
					<h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
						{type === "person" ? "Select a Person" : "Select a Group"}
					</h2>
					<div className="text-center py-4 text-gray-500">Loading...</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity ${
				isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
			onClick={onClose}
		>
			<div
				className="bg-white dark:bg-gray-900 rounded-lg p-6 w-96 max-h-80 flex flex-col shadow-lg"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
					{type === "person" ? "Select a Person" : "Select a Group"}
				</h2>

				<div className="flex-1 overflow-y-auto space-y-2 mb-4">
					{isLoadingUsers ? (
						<div className="text-center py-4 text-gray-500">Loading...</div>
					) : !users || users.length === 0 ? (
						<div className="text-center py-4 text-gray-500">
							No users available
						</div>
					) : (
						users.map(
							(user) =>
								user.id !== currentUser?.id && (
									<button
										key={user.id}
										onClick={() => {
											onSelect(
												user.id,
												user.full_name || user.username || "Unknown",
											);
											onClose();
										}}
										disabled={isLoading}
										className="w-full text-left p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-3"
									>
										{user.avatar_url ? (
											<Image
												width={40}
												height={40}
												src={user.avatar_url}
												alt={user.username || "User Avatar"}
												className="w-10 h-10 rounded-full"
											/>
										) : (
											<div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
												{user.username?.[0].toUpperCase() || "U"}
											</div>
										)}
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												{user.full_name || user.username}
											</p>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												@{user.username}
											</p>
										</div>
									</button>
								),
						)
					)}
				</div>

				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={onClose}
						className="flex-1"
						disabled={isLoading}
					>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
};
