import {
	getAIRoom,
	getRecentRooms,
	updateGroupDetails,
} from "@/actions/messagesActions";
import {
	addUsersToGroup,
	leaveRoom,
	removeMemeber,
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

			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rooms"] });
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

/*================= Get Room Members =================*/
// export const useGetRoomMembers = (roomId: string) => {
// 	return useQuery({
// 		queryKey: ["roomMembers", roomId],
// 		queryFn: async () => await getRoomMembers(roomId),
// 		enabled: !!roomId,
// 	});
// };

/*================= Get Recent Rooms =================*/
export const useRecentRooms = (limit: number = 10) => {
	return useQuery({
		queryKey: ["recent-rooms", limit],
		queryFn: async () => await getRecentRooms(limit),
	});
};

/*================= Get Room Details =================*/

// export const useGetRoomDetails = (roomId: string) => {
// 	return useQuery({
// 		queryKey: ["room-details", roomId],
// 		queryFn: async () => await getRoomDetails(roomId),
// 		enabled: !!roomId,
// 	});
// };

//*================= Add User to Group =================*/
export const useGetNonGroupUsers = (roomId: string) => {
	return useQuery({
		queryKey: ["nonGroupUsers", roomId],
		queryFn: async () => await getNonGroupUsers(roomId),
		enabled: !!roomId,
	});
};

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
		}) => addUsersToGroup(usersIds, roomId),
		onSuccess: (_, { roomId }) => {
			console.log("Adding ", roomId);
			queryClient.invalidateQueries({
				queryKey: ["nonGroupUsers", roomId],
			});
			// queryClient.invalidateQueries({
			// 	queryKey: ["room-details", result.roomId],
			// });
			// router.refresh();
			// toast.success(result.message || "User added to group successfully");
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to add user to group. Please try again.",
			);
			console.error("Failed to add user to group:", error);
		},
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
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["updateGroupDetails"],
		mutationFn: async ({
			roomId,
			updates,
		}: {
			roomId: string;
			updates: {
				name?: string;
				bio?: string;
			};
		}) => await updateGroupDetails({ roomId, updates }),
		// onSuccess: (_, { roomId }) => {
		// 	// queryClient.invalidateQueries({ queryKey: ["room-details", roomId] });
		// },
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to update group details. Please try again.",
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

// Leave Room
export const useLeaveRoom = () => {
	const queryClient = useQueryClient();
	const router = useRouter();
	return useMutation({
		mutationKey: ["leave-room"],
		mutationFn: async ({ roomId }: { roomId: string }) =>
			await leaveRoom(roomId),
		onSuccess: async (_, { roomId }) => {
			console.log("Leaving room with ID:", roomId);
			queryClient.invalidateQueries({ queryKey: ["recent-rooms"] });
			queryClient.invalidateQueries({ queryKey: ["nonGroupUsers", roomId] });
			await queryClient.refetchQueries({
				queryKey: ["nonGroupUsers", roomId],
			});

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
