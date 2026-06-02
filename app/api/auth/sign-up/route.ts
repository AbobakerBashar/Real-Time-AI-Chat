import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { full_name, email, password, username } = await request.json();
		const supabase = await createClient();

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name,
					username,
				},
			},
		});

		if (error) {
			throw new Error(error.message);
		}
		return NextResponse.json(
			{
				success: true,
				user: data.user,
			},
			{ status: 200 },
		);
	} catch (error) {
		if (error instanceof Error) {
			return new NextResponse(
				JSON.stringify({
					error: error.message,
					success: false,
				}),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				},
			);
		} else {
			return new NextResponse(
				JSON.stringify({
					error: "An unknown error occurred",
					success: false,
				}),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
	}
}
