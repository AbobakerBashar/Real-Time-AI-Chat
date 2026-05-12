import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "./lib/supabase/server";

export async function proxy(req: NextRequest) {
	const res = NextResponse.next();
	const supabase = await createClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	// List of protected routes
	const protectedRoutes = ["/dashboard", "/chat"];

	const pathname = req.nextUrl.pathname;

	const isProtected = protectedRoutes.some((route) =>
		pathname.startsWith(route),
	);

	if (isProtected && !session) {
		const redirectUrl = new URL("/auth/login", req.url);
		redirectUrl.searchParams.set("redirect", pathname); // optional
		return NextResponse.redirect(redirectUrl);
	}

	return res;
}

export const config = {
	matcher: ["/dashboard/:path*", "/chat/:path*"],
};
