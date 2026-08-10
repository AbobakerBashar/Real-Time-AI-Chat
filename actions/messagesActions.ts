"use server";

import { createClient } from "@/lib/supabase/server";
import { Member } from "@/types/auth";
import { AttachmentResponse, MinimalMessage } from "@/types/messages";
import { getCurrentUser } from "./userAction";
import { RecentRoom } from "@/types/rooms";

export const getMessages = async (
	roomId: string,
): Promise<MinimalMessage[]> => {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("messages")
		.select("id, content, created_at, is_ai, sender_id, attachments")
		.eq("room_id", roomId)
		.order("created_at", { ascending: true });

	if (error) throw new Error(error.message);

	return data;
};

/*================= Get Room Members =================*/
// export const getRoomMembers = async (
// 	roomId: string,
// ): Promise<Member[] | undefined> => {
// 	const supabase = await createClient();
// 	const { data, error } = await supabase
// 		.from("room_members")
// 		.select("profiles(id, username, full_name, avatar_url, is_active)")
// 		.eq("room_id", roomId);

// 	if (error) throw error;

// 	const members = (data as RawMember[])
// 		.map((member) => {
// 			const profile = Array.isArray(member.profiles)
// 				? member.profiles[0]
// 				: member.profiles;

// 			if (!profile) return null;

// 			return {
// 				id: profile.id,
// 				username: profile.username,
// 				full_name: profile.full_name,
// 				avatar_url: profile.avatar_url,
// 				is_active: profile.is_active,
// 			};
// 		})
// 		.filter((m): m is Member => m !== null);

// 	return members;
// };

/*================= Get Recent Rooms =================*/
export const getRecentRooms = async (
	limit: number = 10,
): Promise<RecentRoom[]> => {
	const supabase = await createClient();

	const user = await getCurrentUser();

	if (!user) return [];

	const { data: memberships, error } = await supabase
		.from("room_members")
		.select(
			`
      room_id,
      last_read_at,
      rooms (
        id,
        name,
        chat_type,
        avatar_url,
        last_message,
        last_message_at,
        last_sender_id
      )
    `,
		)
		.eq("user_id", user.id);

	if (error || !memberships) {
		console.error(error);
		return [];
	}

	const rooms = await Promise.all(
		memberships.map(async (membership): Promise<RecentRoom | null> => {
			const room = Array.isArray(membership.rooms)
				? membership.rooms[0]
				: membership.rooms;

			if (!room) return null;

			let profileInfo: Member | undefined;

			if (room.chat_type === "person") {
				const { data: otherMember } = await supabase
					.from("room_members")
					.select(
						`
              profiles (
                id,
                username,
                full_name,
                avatar_url,
                is_active
              )
            `,
					)
					.eq("room_id", room.id)
					.neq("user_id", user.id)
					.maybeSingle();

				profileInfo = Array.isArray(otherMember?.profiles)
					? otherMember.profiles[0]
					: otherMember?.profiles;
			}

			return {
				id: room.id,

				name:
					room.chat_type === "person"
						? profileInfo?.full_name || "Unknown User"
						: room.name,

				chat_type: room.chat_type,

				username: profileInfo?.username,

				avatar_url:
					room.chat_type === "person"
						? profileInfo?.avatar_url
						: room.avatar_url,

				is_active: profileInfo?.is_active,

				last_message: room.last_message,

				last_message_at: room.last_message_at,

				sent_by_current_user: room.last_sender_id === user.id,
			};
		}),
	);

	return rooms
		.filter((room): room is RecentRoom => room !== null)
		.sort(
			(a, b) =>
				new Date(b.last_message_at ?? 0).getTime() -
				new Date(a.last_message_at ?? 0).getTime(),
		)
		.slice(0, limit);
};

export const getUnreadCounts = async (): Promise<Record<string, number>> => {
	const supabase = await createClient();

	const user = await getCurrentUser();

	if (!user) return {};

	const { data: memberships, error } = await supabase
		.from("room_members")
		.select("room_id, last_read_at")
		.eq("user_id", user.id);

	if (error || !memberships) {
		console.error(error);
		return {};
	}

	const counts = await Promise.all(
		memberships.map(async (membership) => {
			let query = supabase
				.from("messages")
				.select("id", {
					count: "exact",
					head: true,
				})
				.eq("room_id", membership.room_id)
				.neq("sender_id", user.id);

			if (membership.last_read_at) {
				query = query.gt("created_at", membership.last_read_at);
			}

			const { count, error } = await query;

			if (error) {
				console.error(error);
				return {
					roomid: membership.room_id,
					count: 0,
				};
			}

			return {
				room_id: membership.room_id,
				count: count ?? 0,
			};
		}),
	);

	return counts.reduce(
		(acc, item) => {
			acc[item.room_id] = item.count;
			return acc;
		},
		{} as Record<string, number>,
	);
};

export const updateRoomLastMessage = async (
	roomId: string,
	message: string,
) => {
	const supabase = await createClient();
	const user = await getCurrentUser();
	if (!user) return;
	await supabase
		.from("rooms")
		.update({
			last_message: message,
			last_message_at: new Date().toISOString(),
			last_sender_id: user.id,
		})
		.eq("id", roomId);
};

//*================= Get AI Room =================*/
export const getAIRoom = async (): Promise<RecentRoom | null> => {
	const user = await getCurrentUser();
	if (!user) return null;

	const supabase = await createClient();
	const { data, error } = await supabase
		.from("rooms")
		.select("id, name, chat_type")
		.eq("is_ai", true)
		.eq("created_by", user.id)
		.maybeSingle();

	if (error) throw error;

	return data;
};

// Load media files for a specific room
export const getRoomMediaFiles = async (
	roomId: string,
): Promise<AttachmentResponse[]> => {
	const user = await getCurrentUser();
	if (!user) return [];

	const supabase = await createClient();
	const { data: member, error: memberError } = await supabase
		.from("room_members")
		.select("user_id")
		.eq("room_id", roomId)
		.eq("user_id", user.id)
		.maybeSingle();
	if (memberError) throw new Error(memberError.message);
	if (!member) {
		throw new Error("You are not a member of this room.");
	}

	const { data, error } = await supabase
		.from("messages")
		.select("attachments")
		.eq("room_id", roomId)
		.order("created_at", { ascending: false });

	if (error) throw new Error(error.message);

	if (!data) return [];

	const attachments: AttachmentResponse[] = [];

	data.forEach((message) => {
		if (message.attachments) {
			attachments.push(...message.attachments);
		}
	});

	return attachments;
};
