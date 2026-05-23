"use server";

import { createClient } from "@/lib/supabase/server";
import { Member, RawMember } from "@/types/auth";
import { MinimalMessage } from "@/types/messages";
import { getCurrentUser } from "./userAction";
import { RecentRoom, RoomDetails } from "@/types/rooms";

export const getMessages = async (
	roomId: string,
): Promise<MinimalMessage[]> => {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("messages")
		.select("id, content, created_at, is_ai, sender_id, attachments")
		.eq("room_id", roomId)
		.order("created_at", { ascending: true });

	if (error) throw error;

	return data;
};

/*================= Get Room Members =================*/
export const getRoomMembers = async (
	roomId: string,
): Promise<Member[] | undefined> => {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("room_members")
		.select("profiles(id, username, full_name, avatar_url, is_active)")
		.eq("room_id", roomId);

	if (error) throw error;

	const members = (data as RawMember[])
		.map((member) => {
			const profile = Array.isArray(member.profiles)
				? member.profiles[0]
				: member.profiles;

			if (!profile) return null;

			return {
				id: profile.id,
				username: profile.username,
				full_name: profile.full_name,
				avatar_url: profile.avatar_url,
				is_active: profile.is_active,
			};
		})
		.filter((m): m is Member => m !== null);

	return members;
};

/*================= Get Recent Rooms =================*/
export const getRecentRooms = async (
	limit: number = 10,
): Promise<RecentRoom[] | undefined> => {
	const supabase = await createClient();

	const user = await getCurrentUser();

	if (!user) return [];

	// Get rooms where the user is a member, ordered by latest message
	const { data: rooms, error: roomsError } = await supabase
		.from("room_members")
		.select("room_id, rooms(name, is_ai)")
		.eq("user_id", user.id);

	if (roomsError) {
		console.error("Error fetching rooms:", roomsError);
		return [];
	}

	// Extract and format room data with latest message
	const formattedRooms = await Promise.all(
		(rooms || []).map(async (item) => {
			if (!item.room_id) return null;

			// Get the latest message in this room
			const { data: latestMessage } = await supabase
				.from("messages")
				.select("content, created_at, sender_id")
				.eq("room_id", item.room_id)
				.order("created_at", { ascending: false })
				.limit(1)
				.maybeSingle();

			const roomInfo = item.rooms?.[0] || item.rooms;

			return {
				id: item.room_id,
				name: roomInfo?.name,
				is_ai: roomInfo?.is_ai,
				last_message: latestMessage?.content,
				last_message_at: latestMessage?.created_at,
				sent_by_current_user: latestMessage?.sender_id === user.id,
			};
		}),
	);

	return formattedRooms?.filter((room) => room !== null).slice(0, limit);
};

/*================= Get Room Details =================*/
export const getRoomDetails = async (
	roomId: string,
): Promise<RoomDetails | null> => {
	const supabase = await createClient();

	const { data: room, error: roomError } = await supabase
		.from("rooms")
		.select("name, chat_type")
		.eq("id", roomId)
		.maybeSingle();
	if (roomError) throw roomError;
	if (!room) return null;

	if (room.chat_type === "group") {
		const { data: members, error: membersError } = await supabase
			.from("room_members")
			.select("profiles(id, username, full_name, avatar_url)")
			.eq("room_id", roomId);
		if (membersError) throw membersError;

		const formattedMembers = (members || [])
			.map((member) => {
				const profile = Array.isArray(member.profiles)
					? member.profiles[0]
					: member.profiles;

				if (!profile) return null;

				return {
					id: profile.id,
					username: profile.username,
					full_name: profile.full_name,
					avatar_url: profile.avatar_url,
				};
			})
			.filter((m): m is Member => m !== null);

		return {
			name: room.name,
			type: room.chat_type,
			members: formattedMembers,
		};
	} else if (room.chat_type === "ai") {
		return {
			name: room.name,
			type: room.chat_type,
		};
	} else if (room.chat_type === "person") {
		// For person-to-person chats, we can fetch the other member's details
		const { data: members, error: membersError } = await supabase
			.from("room_members")
			.select("profiles(id, username, full_name, avatar_url)")
			.eq("room_id", roomId);
		if (membersError) throw membersError;
		const formattedMembers = (members || [])
			.map((member) => {
				const profile = Array.isArray(member.profiles)
					? member.profiles[0]
					: member.profiles;

				if (!profile) return null;

				return {
					id: profile.id,
					username: profile.username,
					full_name: profile.full_name,
					avatar_url: profile.avatar_url,
				};
			})
			.filter((m): m is Member => m !== null);

		return {
			name: room.name,
			type: room.chat_type,
			members: formattedMembers,
		};
	} else {
		return null;
	}
};

//*================= Get AI Room =================*/
export const getAIRoom = async (): Promise<RecentRoom | null> => {
	const user = await getCurrentUser();
	if (!user) return null;

	const supabase = await createClient();
	const { data, error } = await supabase
		.from("rooms")
		.select("id, name, is_ai")
		.eq("is_ai", true)
		.eq("created_by", user.id)
		.maybeSingle();

	if (error) throw error;

	return data;
};

/*=================   =================*/
