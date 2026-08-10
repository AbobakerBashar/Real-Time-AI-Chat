"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import {
	MinimalProfile,
	Profile,
	UpdateAvatarInput,
	UpdateProfileInput,
	UserProfile,
} from "@/types/auth";
import type { User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export const getCurrentUser = async (): Promise<User | null> => {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();

	if (!data.user || error) return null;

	return data.user;
};

/*=========================== Get Current User Profile ===========================*/

export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
	const supabase = await createClient();

	const user = await getCurrentUser();
	if (!user) return null;

	const { data, error } = await supabase
		.from("profiles")
		.select(
			"id, username, full_name, avatar_url, is_active, created_at, show_last_seen, last_seen, show_online_status, enable_notifications, enable_sound_effects",
		)
		.eq("id", user.id)
		.single();

	if (error || !data) {
		console.error("Error fetching user profile:", error);
		return null;
	}

	return { ...data, email: user.email || "" };
};

/*=========================== Get User List ===========================*/

export const getUserList = async (): Promise<MinimalProfile[] | undefined> => {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("profiles")
		.select("id, username, full_name, avatar_url");
	if (error) {
		return [];
	}
	return data;
};

/*======================== Update Profile ============*/

export const updateUserProfile = async (
	profileData: UpdateProfileInput,
): Promise<Profile | null> => {
	const supabase = await createClient();
	const user = await getCurrentUser();

	if (!user) throw new Error("User not authenticated");

	const { data, error } = await supabase
		.from("profiles")
		.update(profileData)
		.eq("id", user.id);

	if (error) {
		throw new Error(error.message);
	}

	revalidatePath("/dashboard/profile");

	return data;
};

type UpdateAvatarResult = { success: boolean };
export const updateUserAvatar = async (
	avatarData: UpdateAvatarInput,
): Promise<UpdateAvatarResult> => {
	const supabase = await createClient();
	const user = await getCurrentUser();
	if (!user) throw new Error("User not authenticated");

	if (avatarData.image_file) {
		const fileExt = avatarData.image_file.name.split(".").pop();
		const fileName = `${user.id}-${Date.now()}.${fileExt}`;
		const { error: uploadError } = await supabase.storage
			.from("avatars")
			.upload(fileName, avatarData.image_file);

		if (uploadError) throw uploadError;

		const { data: publicData } = supabase.storage
			.from("avatars")
			.getPublicUrl(fileName);
		const publicUrl = publicData.publicUrl;

		const { error: updateError } = await supabase
			.from("profiles")
			.update({ avatar_url: publicUrl })
			.eq("id", user.id);

		if (updateError) throw updateError;
	} else if (avatarData.old_image_url) {
		const oldPath = avatarData.old_image_url.split(
			"/storage/v1/object/public/",
		)[1];
		const { error: deleteError } = await supabase.storage
			.from("avatars")
			.remove([oldPath]);

		if (deleteError) throw deleteError;
	}
	revalidatePath("/dashboard/profile");
	return { success: true };
};

/*================= Get Users Who DO NOT Have a Room With Current User =================*/

export const getUsersWithoutRoom = async (): Promise<MinimalProfile[]> => {
	const supabase = await createClient();
	const user = await getCurrentUser();
	if (!user) return [];

	// 1. Get rooms current user belongs to
	const { data: myRooms } = await supabase
		.from("room_members")
		.select("room_id")
		.eq("user_id", user.id);

	const roomIds = myRooms?.map((r) => r.room_id) || [];

	// 2. Get users who share a room with current user
	const { data: existingPartners } = await supabase
		.from("room_members")
		.select(
			`
    user_id,
    room_id,
    rooms!inner (chat_type)
  `,
		)
		.in("room_id", roomIds)
		.neq("user_id", user.id)
		.neq("rooms.chat_type", "group");

	const usersWithRoomIds = existingPartners?.map((p) => p.user_id) || [];

	// const { data: withRooms, error: withRoomsError } = await supabase
	// 	.from("profiles")
	// 	.select("id, username, full_name, avatar_url, is_active")
	// 	.in("id", usersWithRoomIds)
	// 	.neq("id", user.id);
	// if (withRoomsError) throw new Error(withRoomsError.message);

	// 3. Get all users except:
	// 1- current user
	// 2- users in usersWithRoomIds
	const { data: users, error: usersError } = await supabase
		.from("profiles")
		.select("id, username, full_name, avatar_url, is_active")
		.neq("id", user.id)
		.not("id", "in", `(${usersWithRoomIds.join(",") || ""})`);
	if (usersError) throw new Error(usersError.message);

	return (users as MinimalProfile[]) || [];
};

export const getNonGroupUsers = async (
	roomId: string,
): Promise<MinimalProfile[]> => {
	const supabase = await createClient();
	const user = await getCurrentUser();
	if (!user) return [];

	const { data: members, error } = await supabase
		.from("room_members")
		.select("user_id")
		.eq("room_id", roomId);
	if (error) throw new Error(error.message);
	const memberIds = members?.map((m) => m.user_id) || [];

	const { data: users, error: usersError } = await supabase
		.from("profiles")
		.select("id, username, full_name, avatar_url, is_active")
		.neq("id", user.id)
		.not("id", "in", `(${memberIds.join(",") || ""})`);
	if (usersError) throw new Error(usersError.message);

	return (users as MinimalProfile[]) || [];
};

// Change Password
export const changeUserPassword = async (
	currentPassword: string,
	newPassword: string,
): Promise<void> => {
	const supabase = await createClient();
	const user = await getCurrentUser();
	if (!user) throw new Error("User not authenticated");
	const { error: currentPasswordError } =
		await supabase.auth.signInWithPassword({
			email: user.email!,
			password: currentPassword,
		});

	if (currentPasswordError) {
		throw new Error(
			currentPasswordError.message || "Current password is incorrect",
		);
	}

	await supabase.auth.updateUser({
		password: newPassword,
	});
};

// Delete account
export const deleteAccount = async (): Promise<void> => {
	const user = await getCurrentUser();
	if (!user) throw new Error("User not authenticated");

	const admin = createAdminClient();

	// 1. Anonymize profile
	const { error: profileError } = await admin
		.from("profiles")
		.update({
			username: "Deleted User",
			full_name: "Deleted User",
			avatar_url: null,
			deleted_at: new Date().toISOString(),
		})
		.eq("id", user.id);

	if (profileError)
		throw new Error(profileError.message || "Failed to anonymize profile");

	// 2. Remove from all rooms/groups
	const { error: memberError } = await admin
		.from("room_members")
		.delete()
		.eq("user_id", user.id);

	if (memberError)
		throw new Error(memberError.message || "Failed to remove user from rooms");

	// 3. Handle rooms owned by the user

	// transfer ownership of groups
	const { data: ownedGroups } = await admin
		.from("rooms")
		.select("id")
		.eq("created_by", user.id)
		.eq("chat_type", "group");

	if (ownedGroups) {
		for (const group of ownedGroups) {
			const { data: newOwner } = await admin
				.from("room_members")
				.select("user_id")
				.eq("room_id", group.id)
				.neq("user_id", user.id)
				.limit(1)
				.maybeSingle();

			if (newOwner) {
				await admin
					.from("rooms")
					.update({ created_by: newOwner.user_id })
					.eq("id", group.id);

				await admin
					.from("room_members")
					.update({ role: "owner" })
					.eq("room_id", group.id)
					.eq("user_id", newOwner.user_id);
			}
		}
		revalidatePath("/");
	}

	// 4. Delete auth account
	const { error: authError } = await admin.auth.admin.deleteUser(user.id);

	if (authError)
		throw new Error(authError.message || "Failed to delete account");
};
