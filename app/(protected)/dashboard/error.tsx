"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Helpful in dev; avoids crashing UI.
		console.error("Dashboard error:", error);
	}, [error]);

	return (
		<div className="min-h-[60vh] flex items-center justify-center p-4">
			<div className="w-full max-w-xl rounded-2xl border border-red-200/70 dark:border-red-900/40 bg-white/70 dark:bg-gray-950/50 backdrop-blur p-6">
				<div className="flex items-start gap-3">
					<div className="mt-1 rounded-full bg-red-50 dark:bg-red-950/30 p-2">
						<AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
					</div>
					<div className="space-y-2">
						<h1 className="text-lg font-semibold text-gray-900 dark:text-white">
							Something went wrong
						</h1>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							We couldn’t load your dashboard. Please try again.
						</p>

						{error?.message ? (
							<p className="text-xs text-gray-500 dark:text-gray-500 wrap-break-word">
								{error.message}
							</p>
						) : null}
					</div>
				</div>

				<div className="mt-5 grid grid-cols-2 gap-3">
					<Button onClick={() => reset()}>Try again</Button>
					<Link href="/dashboard">
						<Button variant="outline">Back to dashboard</Button>
					</Link>
				</div>

				<p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
					If this keeps happening, head to the chat and come back.
				</p>
			</div>
		</div>
	);
}
