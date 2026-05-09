"use server";

import { createClient } from "@/lib/supabase/server";
import { Member, RawMember } from "@/types/auth";
import { MinimalMessage } from "@/types/messages";

export const getMessages = async (
	roomId: string,
): Promise<MinimalMessage[]> => {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("messages")
		.select("id, content, created_at, is_ai")
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
