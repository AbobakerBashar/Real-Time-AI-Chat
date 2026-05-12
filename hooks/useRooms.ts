import { getRoomMembers, getRecentRooms } from "@/actions/messagesActions";
import { CreateRoomInput, CreateRoomResponse } from "@/types/rooms";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
		queryKey: ["recentRooms", limit],
		queryFn: async () => await getRecentRooms(limit),
		refetchInterval: 30000, // Refetch every 30 seconds
	});
};
