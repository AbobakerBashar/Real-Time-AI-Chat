import { Card, CardContent, CardHeader } from "../ui/card";

type AccountInfoProps = {
	profileId: string;
	createdAt: string | null | undefined;
};

const AccountInfo = ({ profileId, createdAt }: AccountInfoProps) => {
	return (
		<Card>
			<CardHeader>
				<h3 className="text-lg font-semibold">Account Information</h3>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex justify-between items-center text-sm">
					<span className="text-muted-foreground">User ID</span>
					<code className="text-xs bg-muted px-2 py-1 rounded">
						{profileId.substring(0, 12)}...
					</code>
				</div>
				<div className="flex justify-between items-center text-sm">
					<span className="text-muted-foreground">Member Since</span>
					<span className="font-medium">
						{createdAt &&
							new Date(createdAt).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
					</span>
				</div>
			</CardContent>
		</Card>
	);
};

export default AccountInfo;
