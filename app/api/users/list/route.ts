import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const supabase = await createClient();
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Fetch all profiles except current user
		const { data: profiles, error: profilesError } = await supabase
			.from("profiles")
			.select("id, username, full_name, avatar_url")
			.neq("id", user.id);

		if (profilesError) throw profilesError;

		return NextResponse.json(profiles || [], { status: 200 });
	} catch (error) {
		if (error instanceof Error) {
			console.error("Error fetching users:", error.message);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "An unknown error occurred" },
			{ status: 500 },
		);
	}
}
