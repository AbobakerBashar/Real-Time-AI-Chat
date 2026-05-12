"use server";

import { createClient } from "@/lib/supabase/server";
import { Member, RawMember } from "@/types/auth";
import { MinimalMessage } from "@/types/messages";
import { getCurrentUser } from "./userAction";
import { RecentRoom } from "@/types/rooms";

export const getMessages = async (
	roomId: string,
): Promise<MinimalMessage[]> => {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("messages")
		.select("id, content, created_at, is_ai, sender_id")
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
): Promise<RecentRoom[]> => {
	const supabase = await createClient();

	const user = await getCurrentUser();

	if (!user) return [];

	// Get rooms where the user is a member, ordered by latest message
	const { data: rooms, error: roomsError } = await supabase
		.from("rooms")
		.select("id, name, is_ai")
		.eq("created_by", user.id)
		.order("created_at", { ascending: false });

	if (roomsError) {
		console.error("Error fetching rooms:", roomsError);
		return [];
	}

	// Extract and format room data with latest message
	const formattedRooms = await Promise.all(
		(rooms || []).map(async (item: RecentRoom) => {
			if (!item.id) return null;

			// Get the latest message in this room
			const { data: latestMessage } = await supabase
				.from("messages")
				.select("content, created_at")
				.eq("room_id", item.id)
				.order("created_at", { ascending: false })
				.limit(1)
				.maybeSingle();

			return {
				id: item.id,
				name: item.name,
				is_ai: item.is_ai,
				last_message: latestMessage?.content,
				last_message_at: latestMessage?.created_at,
			};
		}),
	);

	return formattedRooms.filter((room) => room !== null).slice(0, limit);
};
