import { UserProfile } from "@/types/auth";
import { Mail, UserIcon } from "lucide-react";

const ViewMode = ({ profile }: { profile: UserProfile | null | undefined }) => {
	return (
		<div className="space-y-4">
			{/* Full Name */}
			<div className="flex items-start gap-4 pb-4 border-b border-border">
				<UserIcon className="size-5 text-muted-foreground mt-1" />
				<div className="flex-1">
					<p className="text-sm text-muted-foreground mb-1">Full Name</p>
					<p className="text-foreground font-medium">
						{profile?.full_name || "Not set"}
					</p>
				</div>
			</div>

			{/* Username */}
			<div className="flex items-start gap-4 pb-4 border-b border-border">
				<UserIcon className="size-5 text-muted-foreground mt-1" />
				<div className="flex-1">
					<p className="text-sm text-muted-foreground mb-1">Username</p>
					<p className="text-foreground font-medium">
						{profile?.username ? `@${profile.username}` : "Not set"}
					</p>
				</div>
			</div>

			{/* Email */}
			<div className="flex items-start gap-4">
				<Mail className="size-5 text-muted-foreground mt-1" />
				<div className="flex-1">
					<p className="text-sm text-muted-foreground mb-1">Email</p>
					<p className="text-foreground font-medium">{profile?.email}</p>
				</div>
			</div>
		</div>
	);
};

export default ViewMode;
