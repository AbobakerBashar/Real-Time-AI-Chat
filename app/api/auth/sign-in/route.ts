import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { email, password } = await request.json();
		const supabase = await createClient();
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			throw error;
		}
		return NextResponse.json(
			{ success: true, user: data.user },
			{ status: 200 },
		);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json(
				{ success: false, message: "Login failed", error: error.message },
				{ status: 500 },
			);
		} else {
			return NextResponse.json(
				{ success: false, message: "Login failed", error: "Unknown error" },
				{ status: 500 },
			);
		}
	}
}
