import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
	return (
		<div className="min-h-[60vh] flex items-center justify-center p-4">
			<div className="text-center space-y-6 max-w-md">
				<div className="text-6xl font-bold text-gray-800 dark:text-gray-200">
					404
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Page not found
					</h1>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						The dashboard route you requested doesn’t exist (or you don’t have
						access).
					</p>
				</div>

				<div className="flex gap-3 justify-center flex-wrap">
					<Link href="/dashboard">
						<Button className="gap-2" size="lg">
							<ArrowLeft className="h-4 w-4" />
							Back to Dashboard
						</Button>
					</Link>
					<Link href="/chat">
						<Button variant="outline" size="lg">
							Go to Chats
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
