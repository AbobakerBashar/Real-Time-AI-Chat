import {
	getAIRoom,
	getRecentRooms,
	getUnreadCounts,
} from "@/actions/messagesActions";
import { addNotification } from "@/actions/notifications";
import {
	addUsersToGroup,
	deleteRoom,
	leaveRoom,
	removeMemeber,
	updateGroupAvatar,
	updateGroupDetails,
	updateMemberRole,
} from "@/actions/room";
import { getNonGroupUsers } from "@/actions/userAction";
import { CreateRoomInput, CreateRoomResponse } from "@/types/rooms";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateRoom = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["createRoom"],
		mutationFn: async (data: CreateRoomInput) => {
			const res = await fetch("/api/rooms/create", {
				method: "POST",
				body: JSON.stringify(data),
			});

			const result: CreateRoomResponse = await res.json();

			if (!res.ok) {
				throw new Error(result.error || "Failed to create room");
			}

			if (
				result.success &&
				result.roomId &&
				data.chat_type === "person" &&
				data.other_user_id
			) {
				await addNotification({
					message: `You have a new chat from ${data.username}`,
					type: "new_chat",
					title: "New Chat",
					entity_id: result.roomId,
					entity_type: "room",
					user_id: data.other_user_id,
				});
			}

			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["recent-rooms"] });
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to create room. Please try again.",
			);
		},
	});
};

//*================= Get non Group Users =================*/
export const useGetNonGroupUsers = (roomId: string) => {
	return useQuery({
		queryKey: ["nonGroupUsers", roomId],
		queryFn: async () => await getNonGroupUsers(roomId),
		enabled: !!roomId,
	});
};

//*================= Add User to Group =================*/
export const useAddUserToGroup = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["addUserToGroup"],
		mutationFn: async ({
			roomId,
			usersIds,
		}: {
			roomId: string;
			usersIds: string[];
		}) => {
			await addUsersToGroup(usersIds, roomId);

			for (const userId of usersIds) {
				await addNotification({
					message: `You have been added to a group chat`,
					type: "new_chat",
					title: "New Chat",
					entity_id: roomId,
					entity_type: "room",
					user_id: userId,
				});
			}
		},
		onSuccess: (_, { roomId }) => {
			console.log("Adding ", roomId);
			queryClient.invalidateQueries({
				queryKey: ["nonGroupUsers", roomId],
			});
			queryClient.invalidateQueries({
				queryKey: ["recent-rooms"],
			});
			// router.refresh();
			// toast.success(result.message || "User added to group successfully");
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to add user to group. Please try again.",
			);
		},
	});
};

/*================= Get Recent Rooms =================*/
export const useRecentRooms = (limit: number = 10) => {
	return useQuery({
		queryKey: ["recent-rooms", limit],
		queryFn: async () => await getRecentRooms(limit),
	});
};

// *================= Get AI Room Hook =================*/
export const useGetAIRoom = () => {
	return useQuery({
		queryKey: ["ai-room"],
		queryFn: getAIRoom,
	});
};

/*================= Update Group =================*/
export const useUpdateGroupDetails = () => {
	// const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["updateGroupDetails"],
		mutationFn: async ({
			roomId,
			updates,
		}: {
			roomId: string;
			updates: {
				name?: string;
				description?: string;
			};
		}) => await updateGroupDetails({ roomId, updates }),
		onSuccess: () => {
			toast.success("Group details updated successfully!");
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to update group details. Please try again.",
			);
		},
	});
};
// Update Avatar
export const useUpdataeGroupAvatar = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["updateGroupAvatar"],
		mutationFn: async ({
			roomId,
			avatarFile,
			oldAvatarUrl,
		}: {
			roomId: string;
			avatarFile: File;
			oldAvatarUrl: string;
		}) =>
			await updateGroupAvatar({
				roomId,
				avatarFile,
				oldAvatarUrl,
			}),
		onSuccess: (_, { roomId }) => {
			toast.success("Avatar updated successfully!");
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to update group avatar. Please try again.",
			);
		},
	});
};

/*================ Update Member Role ===============*/
export const useUpdateMemberRole = () => {
	// const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["update-member-role"],
		mutationFn: ({
			roomId,
			userId,
			role,
		}: {
			roomId: string;
			userId: string;
			role: string;
		}) =>
			updateMemberRole({
				roomId,
				userId,
				role,
			}),
		onSuccess: () => {
			toast.success("Member role updated successfully");
			// queryClient.invalidateQueries({ queryKey: ["room-details", roomId] });
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to update member role. Please try again.",
			);
		},
	});
};

/*================ Remove Memeber ===============*/
export const useRemoveMemeber = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["remove-member"],
		mutationFn: ({ roomId, userId }: { roomId: string; userId: string }) =>
			removeMemeber({ roomId, userId }),
		onSuccess: (_, { roomId }) => {
			queryClient.invalidateQueries({ queryKey: ["nonGroupUsers", roomId] });
			// queryClient.invalidateQueries({ queryKey: ["room-details", roomId] });

			toast.success("User removed from group successfully");
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to remove user from group. Please try again.",
			);
		},
	});
};

// Leave Room
export const useLeaveRoom = () => {
	const queryClient = useQueryClient();
	const router = useRouter();
	return useMutation({
		mutationKey: ["leave-room"],
		mutationFn: async ({
			roomId,
			newOwnerId,
			chatType,
		}: {
			roomId: string;
			newOwnerId?: string;
			chatType: "group" | "direct";
		}) => await leaveRoom({ roomId, newOwnerId, chatType }),
		onSuccess: async (_, { roomId }) => {
			queryClient.invalidateQueries({ queryKey: ["recent-rooms"] });
			queryClient.invalidateQueries({ queryKey: ["nonGroupUsers", roomId] });
			// await queryClient.refetchQueries({
			// 	queryKey: ["nonGroupUsers", roomId],
			// });

			router.replace("/chat");

			toast.success("You have left the room");
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to leave room. Please try again.",
			);
		},
	});
};

// Delete Room
export const useDeleteRoom = () => {
	const queryClient = useQueryClient();
	const router = useRouter();
	return useMutation({
		mutationKey: ["delete-room"],
		mutationFn: async ({
			roomId,
			chatType,
		}: {
			roomId: string;
			chatType: string;
		}) => deleteRoom({ roomId, chatType }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["recent-rooms"] });
			router.replace("/chat");
			toast.success("Room deleted successfully");
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to delete room. Please try again.",
			);
		},
	});
};

// Get unread counts for a room
export const useUnreadCounts = () => {
	return useQuery({
		queryKey: ["unread-counts"],
		queryFn: getUnreadCounts,
	});
};

// Mark room as read
