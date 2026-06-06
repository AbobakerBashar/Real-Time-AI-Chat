"use client";

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useSignOut } from "@/hooks/useAuth";

const LogoutButton = ({
	className,
	size,
}: {
	className?: string;
	size?: "sm" | "lg" | "xs";
}) => {
	const { mutateAsync: signOut, isPending: isSigningOut } = useSignOut();

	return (
		<Button
			disabled={isSigningOut}
			onClick={async () => await signOut()}
			variant="destructive"
			size={size}
			className={className}
		>
			<LogOut className="mr-1" />
			Logout
		</Button>
	);
};

export default LogoutButton;
