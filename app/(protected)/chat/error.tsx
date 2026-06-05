"use client";

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ChatError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error for debugging
		console.error("Chat Error:", error);
	}, [error]);

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:bg-linear-to-br dark:from-gray-950 dark:via-gray-900 dark:to-black transition-colors duration-300 flex items-center justify-center p-4">
			<div className="text-center space-y-6 max-w-md">
				{/* Error Icon */}
				<div className="text-6xl">⚠️</div>

				{/* Heading */}
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Something Went Wrong
				</h1>

				{/* Description */}
				<p className="text-gray-600 dark:text-gray-400">
					We encountered an error loading your chat. Please try again or contact
					support if the problem persists.
				</p>

				{/* Error Details */}
				{error.message && (
					<div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4">
						<p className="text-sm text-red-800 dark:text-red-200 font-mono wrap-break-word">
							{error.message}
						</p>
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex gap-3 justify-center pt-4">
					<Button onClick={reset} className="gap-2" size="lg">
						<RefreshCcw className="h-4 w-4" />
						<span>Try Again</span>
					</Button>
					<Link href="/chat">
						<Button variant="outline" size="lg">
							← Back to Chats
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
