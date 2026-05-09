import { getCurrentUser, getUserList } from "@/actions/userAction";
import { createClient } from "@/lib/supabase/client";
import {
	SignInInput,
	SignInResponse,
	SignupInput,
	SignupResponse,
} from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
		},
		onError: (error) => {
			console.error("Signup failed:", error);
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
			toast.success("Successfully signed in! Welcome back.");
		},
		onError: (error) => {
			console.error("Sign in failed:", error);
			toast.error(error.message || "Sign in failed. Please try again.");
		},
	});
};

/*================== Sign out Hook ==================*/
export const useSignOut = () => {
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
			toast.success("Successfully signed out. See you next time!");
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

/*================== Get User List Hook ==================*/
export const useUserList = () => {
	return useQuery({
		queryKey: ["userList"],
		queryFn: getUserList,
	});
};
