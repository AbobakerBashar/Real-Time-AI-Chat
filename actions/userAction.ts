"use server";

import { createClient } from "@/lib/supabase/server";
import { MinimalProfile } from "@/types/auth";
import type { User } from "@supabase/supabase-js";

export const getCurrentUser = async (): Promise<User | null> => {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();

	if (!data.user || error) return null;

	return data.user;
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
