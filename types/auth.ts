import type { User } from "@supabase/supabase-js";
import { Database } from "./supabase";

export type SignupInput = {
	email: string;
	password: string;
	full_name: string;
	username: string;
};
export type SignupResponse =
	| {
			success: true;
			user: User | null;
			error?: never;
	  }
	| {
			success: false;
			user?: null;
			error: string;
	  };

export type SignInResponse =
	| {
			success: true;
			user: User | null;
			error?: never;
	  }
	| {
			success: false;
			user?: null;
			error: string;
	  };

export type SignInInput = {
	email: string;
	password: string;
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type MinimalProfile = Pick<
	Profile,
	"id" | "username" | "full_name" | "avatar_url"
>;
export interface RawMember {
	profiles:
		| {
				id: string;
				username: string | null;
				full_name: string | null;
				avatar_url: string | null;
				is_active: boolean;
		  }
		| {
				id: string;
				username: string | null;
				full_name: string | null;
				avatar_url: string | null;
				is_active: boolean;
		  }[]; // This allows for both object or array
}

export interface Member {
	id: string;
	username: string | null;
	full_name: string | null;
	avatar_url: string | null;
	is_active: boolean;
}
