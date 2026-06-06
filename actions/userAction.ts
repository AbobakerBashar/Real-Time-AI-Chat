"use server";

import { createClient } from "@/lib/supabase/server";
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
		.select("id, username, full_name, avatar_url, is_active, created_at")
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
		throw error;
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

// Delete User Account
export const deleteUserAccount = async (): Promise<void> => {
	const supabase = await createClient();
	const user = await getCurrentUser();
	if (!user) throw new Error("User not authenticated");
	const { error } = await supabase.auth.admin.deleteUser(user.id);
	if (error) throw new Error(error.message);
	revalidatePath("/");
};

// Change Password
export const changeUserPassword = async (
	currentPassword: string,
	newPassword: string,
): Promise<void> => {
	const supabase = await createClient();
	const user = await getCurrentUser();
	if (!user) throw new Error("User not authenticated");

	const { error } = await supabase.auth.updateUser({
		password: newPassword,
	});
	if (error) throw new Error(error.message);
	revalidatePath("/dashboard/profile");
};
