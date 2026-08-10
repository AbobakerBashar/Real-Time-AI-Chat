"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "./userAction";
import { revalidatePath } from "next/cache";
import { Member } from "@/types/auth";
import { RoomDetails } from "@/types/rooms";
import { User } from "@supabase/supabase-js";

/*================= Get Room Details =================*/
export const getRoomDetails = async (
	roomId: string,
): Promise<RoomDetails | null> => {
	const user = await getCurrentUser();
	if (!user) return null;

	const supabase = await createClient();

	const { data: room, error: roomError } = await supabase
		.from("rooms")
		.select("name, chat_type, created_by, id, avatar_url, description")
		.eq("id", roomId)
		.maybeSingle();
	if (roomError) throw new Error(roomError.message);
	if (!room) return null;

	if (room.chat_type === "group") {
		const { data: members, error: membersError } = await supabase
			.from("room_members")
			.select(
				`joined_at, role,
				profiles(id, username, full_name, avatar_url, is_active)`,
			)
			.eq("room_id", roomId);
		if (membersError) throw new Error(membersError.message);

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
					joined_at: member.joined_at,
					is_active: profile.is_active,
					role: member.role,
				};
			})
			.filter((m) => m !== null);

		return {
			avatar_url: room.avatar_url,
			description: room.description,
			id: room.id,
			name: room.name,
			type: room.chat_type,
			current_user: {
				id: user.id,
				role: formattedMembers.find((m) => m.id === user.id)?.role,
			},
			members: formattedMembers,
		};
	} else if (room.chat_type === "ai") {
		return {
			id: room.id,
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
				} as Member;
			})
			.filter((m): m is Member => m !== null);

		return {
			id: room.id,
			name: room.name,
			type: room.chat_type,
			members: formattedMembers,
		};
	} else {
		return null;
	}
};

// Add Member to Group

export async function addUsersToGroup(usersIds: string[], roomId: string) {
	if (!Array.isArray(usersIds) || usersIds.length === 0)
		throw new Error("You must provide at least one user");

	const supabase = await createClient();
	const currentUser = (await getCurrentUser()) as User;

	if (!currentUser) throw new Error("Unauthorized");

	// Check if current user is a admin or owner of the room
	const { data: rolrData, error: membershipError } = await supabase
		.from("room_members")
		.select("role")
		.eq("room_id", roomId)
		.eq("user_id", currentUser.id)
		.maybeSingle();

	if (membershipError) throw new Error(membershipError.message);
	if (!rolrData) throw new Error("You are not a member of this room");

	if (rolrData.role === "owner" || rolrData?.role === "admin") {
		// Check if user is already a member of the room
		const { data: existingMember, error: existingError } = await supabase
			.from("room_members")
			.select("user_id")
			.eq("room_id", roomId)
			.in("user_id", usersIds);

		if (existingError) throw new Error(existingError.message);

		const existingIds = new Set(existingMember?.map((m) => m.user_id) ?? []);
		const usersToAdd = usersIds
			.filter((id: string) => !existingIds.has(id))
			?.map((id: string) => ({ room_id: roomId, user_id: id }));

		if (usersToAdd.length === 0)
			throw new Error("All selected users are already members");

		// Add user to room members

		const { error: addError } = await supabase
			.from("room_members")
			.insert(usersToAdd);

		if (addError) throw new Error(addError.message);

		revalidatePath(`/chat/${roomId}`);
		revalidatePath(`/chat/${roomId}/manage`);
	} else {
		throw new Error("You must be admin or owner to add users to this room");
	}
}

// Update Member role
export const updateMemberRole = async ({
	roomId,
	userId,
	role,
}: {
	roomId: string;
	userId: string;
	role: string;
}) => {
	if (!role || !roomId || !userId) return;
	const user = await getCurrentUser();
	if (!user) throw new Error("You are not authenticated");
	const supabase = await createClient();
	const { data, error: roleError } = await supabase
		.from("room_members")
		.select("role")
		.eq("room_id", roomId)
		.eq("user_id", user.id)
		.maybeSingle();

	if (roleError) throw new Error(roleError.message);
	const roleData = data?.role;
	if (roleData === "member") throw new Error("You are not an owner or admin");

	if (roleData === "owner") {
		const { error } = await supabase
			.from("room_members")
			.update({ role })
			.eq("user_id", userId)
			.eq("room_id", roomId);
		if (error) throw new Error(error.message);

		revalidatePath(`/dashboard/chat/${roomId}`);
		revalidatePath(`/dashboard/chat/${roomId}/manage`);

		return;
	} else if (roleData === "admin") {
		if (role === "owner")
			throw new Error("You must be owner to promote to owner");
		else if (role === "member")
			throw new Error("You must be member to demote to member");

		const { error } = await supabase
			.from("room_members")
			.update({ role: "admin" })
			.eq("user_id", userId)
			.eq("room_id", roomId);
		if (error) throw new Error(error.message);

		revalidatePath(`/dashboard/chat/${roomId}`);
		revalidatePath(`/dashboard/chat/${roomId}/manage`);
		return;
	} else throw new Error("You are not an owner or admin");
};

/*================= Update Group Details =================*/
export const updateGroupDetails = async ({
	roomId,
	updates,
}: {
	roomId: string;
	updates: {
		name?: string;
		description?: string;
	};
}) => {
	if (!roomId) return;
	if (!updates.name && !updates.description)
		throw new Error("No updates provided");
	const user = await getCurrentUser();
	if (!user) throw new Error("User not authenticated");

	const supabase = await createClient();

	const { data, error: roleError } = await supabase
		.from("room_members")
		.select("role")
		.eq("room_id", roomId)
		.eq("user_id", user.id)
		.maybeSingle();

	if (roleError) throw new Error(roleError.message);
	if (!data) throw new Error("You are not a member of this room");
	if (data.role !== "owner" && data.role !== "admin")
		throw new Error("You are not an owner or admin to update group details");

	const { error } = await supabase
		.from("rooms")
		.update(updates)
		.eq("id", roomId);
	if (error) throw new Error(error.message);

	revalidatePath(`/chat`);
	revalidatePath(`/chat/${roomId}`);
	revalidatePath(`/chat/${roomId}/manage`);
};

// Update Group avatar
export const updateGroupAvatar = async ({
	roomId,
	avatarFile,
	oldAvatarUrl,
}: {
	roomId: string;
	avatarFile: File;
	oldAvatarUrl: string;
}) => {
	const user = await getCurrentUser();
	if (!user) throw new Error("User not authenticated");
	if (!avatarFile || avatarFile.size === 0)
		throw new Error("No avatar file provided");

	const fileExt = avatarFile.name.split(".").pop();
	const fileName = `${user.id}-${Date.now()}.${fileExt}`;
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("room_members")
		.select("role")
		.eq("room_id", roomId)
		.eq("user_id", user.id)
		.maybeSingle();
	if (error) throw new Error(error.message);
	if (!data) throw new Error("You are not a member of this room");
	if (data.role !== "owner" && data.role !== "admin")
		throw new Error("You are not an owner or admin to update group avatar");

	const { error: uploadError } = await supabase.storage
		.from("avatars")
		.upload(fileName, avatarFile);

	if (uploadError) throw new Error(uploadError.message);

	const { data: publicData } = supabase.storage
		.from("avatars")
		.getPublicUrl(fileName);
	const publicUrl = publicData.publicUrl;
	const { error: updateError } = await supabase
		.from("rooms")
		.update({ avatar_url: publicUrl })
		.eq("id", roomId);

	if (updateError) throw new Error(updateError.message);

	if (oldAvatarUrl) {
		const oldPath = oldAvatarUrl.split("/avatars/")[1];

		if (oldPath) {
			const { error: deleteError } = await supabase.storage
				.from("avatars")
				.remove([oldPath]);
			if (deleteError)
				throw new Error(
					"Avatar updated successfully, but faild to delete old avatar.",
				);
		}
	}
	revalidatePath(`/chat`);
	revalidatePath(`/chat/${roomId}`);
	revalidatePath(`/chat/${roomId}/manage`);
};

// Remove Member
export const removeMemeber = async ({
	roomId,
	userId,
}: {
	roomId: string;
	userId: string;
}) => {
	if (!roomId || !userId) return;
	const user = await getCurrentUser();
	if (!user) throw new Error("User not authenticated");
	const supabase = await createClient();
	const { data, error: roleError } = await supabase
		.from("room_members")
		.select("role, user_id")
		.eq("room_id", roomId)
		.in("user_id", [user.id, userId]);
	if (roleError) throw new Error(roleError.message);

	const role = data?.find((r) => r.user_id === user.id)?.role;
	const targetUserRole = data?.find((r) => r.user_id === userId)?.role;
	if (!targetUserRole) throw new Error("User not found");

	if (role === "owner" || role === "admin") {
		if (role === "admin" && targetUserRole !== "member")
			throw new Error("You are not allowed to remove this member");

		if (targetUserRole === "owner")
			throw new Error("You cannot remove the owner");

		const { error } = await supabase
			.from("room_members")
			.delete()
			.eq("user_id", userId)
			.eq("room_id", roomId);

		if (error) throw new Error(error.message);
		revalidatePath(`/dashboard/chat/${roomId}`);
		revalidatePath(`/dashboard/chat/${roomId}/manage`);
	} else throw new Error("You must be an owner or admin to remove a member");
};

// Leave Room
export const leaveRoom = async ({
	roomId,
	chatType,
	newOwnerId,
}: {
	roomId: string;
	newOwnerId?: string;
	chatType: "direct" | "group";
}) => {
	if (!roomId) return;
	const user = await getCurrentUser();
	if (!user) throw new Error("User not authenticated");
	const supabase = await createClient();

	// If is group leave the group
	if (chatType === "group") {
		// Check if user is owner
		const { data: userRole, error: roleError } = await supabase
			.from("room_members")
			.select("role")
			.eq("room_id", roomId)
			.eq("user_id", user.id)
			.maybeSingle();

		if (roleError) throw new Error(roleError.message);
		if (!userRole) throw new Error("You are not a member of this room");

		// If user is owner and newOwnerId is provided, transfer ownership
		if (userRole.role === "owner" && newOwnerId) {
			const { error: updateError } = await supabase
				.from("room_members")
				.update({ role: "owner" })
				.eq("room_id", roomId)
				.eq("user_id", newOwnerId);

			if (updateError) throw new Error(updateError.message);
		}

		const { error } = await supabase
			.from("room_members")
			.delete()
			.eq("room_id", roomId)
			.eq("user_id", user.id);
		if (error) throw new Error(error.message);
	} else {
		if (chatType === "direct") {
			const { error } = await supabase
				.from("room_members")
				.delete()
				.eq("room_id", roomId)
				.eq("user_id", user.id);
			if (error) throw new Error(error.message);
		}
	}
	revalidatePath(`/chat`);
	revalidatePath(`/chat/${roomId}`);
	revalidatePath(`/chat/${roomId}/manage`);
};

// Delete Room
export const deleteRoom = async ({
	roomId,
	chatType,
}: {
	roomId: string;
	chatType: string;
}) => {
	if (!roomId) return;
	const user = await getCurrentUser();
	if (!user) throw new Error("User not authenticated");
	const supabase = await createClient();

	// if is normarl room, or ai room, just delete the room
	if (chatType === "person" || chatType === "ai" || chatType === "direct") {
		const { error } = await supabase
			.from("rooms")
			.delete()
			.eq("id", roomId)
			.eq("created_by", user.id);
		if (error) throw new Error(error.message);
		revalidatePath(`/chat`);
		revalidatePath(`/chat/${roomId}`);
		revalidatePath(`/chat/${roomId}/manage`);
		return;
	}

	// if is group chat and current user owner of group
	if (chatType === "group") {
		const { data: member, error: memberError } = await supabase
			.from("room_members")
			.select("role")
			.eq("room_id", roomId)
			.eq("user_id", user.id)
			.maybeSingle();
		if (memberError) throw new Error(memberError.message);
		if (!member) throw new Error("Room not found");
		if (member.role === "owner") {
			const { error } = await supabase.from("rooms").delete().eq("id", roomId);
			if (error) throw new Error(error.message);
			revalidatePath(`/chat`);
			revalidatePath(`/chat/${roomId}`);
			revalidatePath(`/chat/${roomId}/manage`);
		}
	}
};

// Mark Room as Read
export const markRoomAsRead = async (roomId: string, lastMessageId: string) => {
	if (!roomId) return;
	const user = await getCurrentUser();
	if (!user) throw new Error("User not authenticated");
	const supabase = await createClient();
	const { error } = await supabase
		.from("room_members")
		.update({
			last_read_message_id: lastMessageId,
			last_read_at: new Date().toISOString(),
		})
		.eq("room_id", roomId)
		.eq("user_id", user.id);
	console.log("Marking room as read ERR:", error);
	if (error) throw new Error(error.message);
	revalidatePath(`/chat/${roomId}`);
};
