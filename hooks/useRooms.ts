import {
	getAIRoom,
	getRecentRooms,
	getRoomDetails,
	getRoomMembers,
} from "@/actions/messagesActions";
import { CreateRoomInput, CreateRoomResponse } from "@/types/rooms";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
			console.error("Failed to create room:", error);
		},
	});
};

/*================= Get Room Members =================*/
export const useGetRoomMembers = (roomId: string) => {
	return useQuery({
		queryKey: ["roomMembers", roomId],
		queryFn: async () => await getRoomMembers(roomId),
		enabled: !!roomId,
	});
};

/*================= Get Recent Rooms =================*/
export const useRecentRooms = (limit: number = 10) => {
	return useQuery({
		queryKey: ["recent-rooms", limit],
		queryFn: async () => await getRecentRooms(limit),
	});
};

/*================= Get Room Details =================*/
export const useGetRoomDetails = (roomId: string) => {
	return useQuery({
		queryKey: ["room-details", roomId],
		queryFn: async () => await getRoomDetails(roomId),
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
			userId,
		}: {
			roomId: string;
			userId: string;
		}) => {
			const res = await fetch(`/api/rooms/${roomId}/members/add`, {
				method: "POST",
				body: JSON.stringify({ userId }),
			});
			const result = await res.json();

			if (!res.ok) {
				throw new Error(result.error || "Failed to add user to group");
			}
			return result;
		},
		onSuccess: (_, { roomId }) => {
			console.log("User added to group successfully", roomId);
			queryClient.invalidateQueries({ queryKey: ["roomMembers", roomId] });
			toast.success("User added to group successfully");
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
