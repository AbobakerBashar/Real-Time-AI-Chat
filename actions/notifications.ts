"use server";

import { NotificationInput } from "@/types/notifications";
import { getCurrentUser } from "./userAction";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const addNotification = async (notification: NotificationInput) => {
	const user = await getCurrentUser();
	if (!user) throw new Error("User not authenticated");

	const supabase = await createClient();
	const { error } = await supabase.from("notifications").insert(notification);

	if (error) throw new Error(error.message);

	revalidatePath("/dashboard");
	revalidatePath("/dashboard/notifications");
};
