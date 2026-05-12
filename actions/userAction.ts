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
		console.error("Error fetching user list:", error);
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
