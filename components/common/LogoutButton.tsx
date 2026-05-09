"use client";

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useSignOut } from "@/hooks/useAuth";

const LogoutButton = () => {
	const { mutateAsync: signOut, isPending: isSigningOut } = useSignOut();

	return (
		<Button
			disabled={isSigningOut}
			onClick={async () => await signOut()}
			variant="destructive"
		>
			<LogOut className="mr-2" />
			Logout
		</Button>
	);
};

export default LogoutButton;
