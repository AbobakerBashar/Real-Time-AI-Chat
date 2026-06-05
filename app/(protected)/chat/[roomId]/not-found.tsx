import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ManageRoomNotFound() {
	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:bg-linear-to-br dark:from-gray-950 dark:via-gray-900 dark:to-black transition-colors duration-300 flex items-center justify-center p-4">
			<div className="text-center space-y-6 max-w-md">
				{/* 404 Icon */}
				<div className="text-6xl font-bold text-gray-800 dark:text-gray-200">
					404
				</div>

				{/* Heading */}
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Room Not Found
				</h1>

				{/* Description */}
				<p className="text-gray-600 dark:text-gray-400">
					The room you&apos;re trying to manage doesn&apos;t exist or you
					don&apos;t have access to it.
				</p>

				{/* Action Buttons */}
				<div className="flex gap-3 justify-center pt-4">
					<Link href="/chat">
						<Button className="gap-2" size="lg">
							<ArrowLeft className="h-4 w-4" />
							<span> Back to Chats</span>
						</Button>
					</Link>
					<Link href="/dashboard">
						<Button variant="outline" size="lg">
							Go to Dashboard
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
