import {
	changeUserPassword,
	deleteAccount,
	getCurrentUser,
	getCurrentUserProfile,
	getUserList,
	getUsersWithoutRoom,
	updateUserAvatar,
	updateUserProfile,
} from "@/actions/userAction";
import { createClient } from "@/lib/supabase/client";
import {
	SignInInput,
	SignInResponse,
	SignupInput,
	SignupResponse,
	UpdateAvatarInput,
	UpdateProfileInput,
	UserProfile,
} from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignup = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: SignupInput) => {
			const response = await fetch("/api/auth/sign-up", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			const result: SignupResponse = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to sign up");
			}
			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			queryClient.invalidateQueries({ queryKey: ["userList"] });
			queryClient.invalidateQueries({ queryKey: ["usersWithoutRoom"] });
			queryClient.invalidateQueries({ queryKey: ["onlineUsers"] });
		},
		onError: (error) => {
			toast.error(error.message || "Signup failed. Please try again.");
		},
	});
};

/*================== Sign in Hook ==================*/
export const useSignIn = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: SignInInput) => {
			const response = await fetch("/api/auth/sign-in", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			const result: SignInResponse = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to sign in");
			}
			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			queryClient.invalidateQueries({ queryKey: ["userList"] });
			queryClient.invalidateQueries({ queryKey: ["onlineUsers"] });
			toast.success("Successfully signed in! Welcome back.");
		},
		onError: (error) => {
			toast.error(error.message || "Sign in failed. Please try again.");
		},
	});
};

/*================== Sign out Hook ==================*/
export const useSignOut = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			const supabase = createClient();
			const { error } = await supabase.auth.signOut();
			if (error) {
				throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			queryClient.invalidateQueries({ queryKey: ["userList"] });
			queryClient.invalidateQueries({ queryKey: ["onlineUsers"] });
			toast.success("Successfully signed out. See you next time!");
			router.refresh();
		},
		onError: (error) => {
			console.error("Sign out failed:", error);
			toast.error(error.message || "Sign out failed. Please try again.");
		},
	});
};

/*================== Get Current User Hook ==================*/
export const useCurrentUser = () => {
	return useQuery({
		queryKey: ["user"],
		queryFn: getCurrentUser,
	});
};

/*================== Change Password Hook ==================*/
export const useChangePassword = () => {
	return useMutation({
		mutationFn: async (data: {
			currentPassword: string;
			newPassword: string;
		}) => await changeUserPassword(data.currentPassword, data.newPassword),
		onSuccess: () => toast.success("Password changed successfully!"),
	});
};

/*================== Delete Account Hook ==================*/
export const useDeleteAccount = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async () => await deleteAccount(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			queryClient.invalidateQueries({ queryKey: ["userList"] });
			toast.success("Account deleted successfully!");
			queryClient.invalidateQueries({ queryKey: ["usersWithoutRoom"] });
			queryClient.invalidateQueries({ queryKey: ["onlineUsers"] });
			router.replace("/");
		},
	});
};

/*================== Get User List Hook ==================*/
export const useUserList = () => {
	return useQuery({
		queryKey: ["userList"],
		queryFn: getUserList,
	});
};

/*================== Get Users Who Do not Have a RoomWith Current User Hook ==================*/
export const useUsersWithoutRoom = () => {
	return useQuery({
		queryKey: ["usersWithoutRoom"],
		queryFn: getUsersWithoutRoom,
	});
};

//*================== Get User Profile Hook ==================*/

export const useCurrentUserProfile = () => {
	return useQuery<UserProfile | null>({
		queryKey: ["userProfile"],
		queryFn: getCurrentUserProfile,
	});
};

/*================== Update User Profile Hook ==================*/

export const useUpdateUserProfile = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (profileData: UpdateProfileInput) => {
			await updateUserProfile(profileData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["userProfile"] });
		},
	});
};

/*================== Update User Avatar Hook ==================*/

export const useUpdateUserAvatar = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (avatarData: UpdateAvatarInput) =>
			await updateUserAvatar(avatarData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["userProfile"] });
			toast.success("Avatar updated successfully!");
		},
		onError: (error) => {
			toast.error(
				error.message || "Failed to update avatar. Please try again.",
			);
		},
	});
};

/*================== Get Online Users Hooks ==================*/
export const useOnlineUsers = () => {
	return useQuery({
		queryKey: ["onlineUsers"],
		queryFn: async () => {
			const user = await getCurrentUserProfile();

			if (!user) {
				throw new Error("User not authenticated");
			}

			const supabase = createClient();

			const channel = supabase.channel("online-users", {
				config: {
					presence: {
						key: user.id,
					},
				},
			});

			channel
				.on("presence", { event: "sync" }, () => {
					const state = channel.presenceState();
					console.log(state);
				})
				.subscribe(async (status) => {
					if (status === "SUBSCRIBED") {
						await channel.track({
							userId: user.id,
							username: user.username,
							onlineAt: new Date().toISOString(),
						});
					}
				});
			return channel;
		},
	});
};
