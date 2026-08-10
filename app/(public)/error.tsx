"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Page error:", error);
	}, [error]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4">
			<div className="max-w-md w-full text-center">
				{/* Icon */}
				<div className="mb-8 flex justify-center">
					<div className="relative">
						<div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl"></div>
						<AlertTriangle className="w-20 h-20 text-amber-600 dark:text-amber-400 relative" />
					</div>
				</div>

				{/* Content */}
				<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
					Something Went Wrong
				</h1>
				<p className="text-slate-600 dark:text-slate-400 mb-6">
					We encountered an unexpected error. Please try again or contact
					support if the problem persists.
				</p>

				{/* Error Details */}
				{error.message && (
					<div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
						<p className="text-sm text-red-700 dark:text-red-400 font-mono wrap-break-word">
							{error.message}
						</p>
						{error.digest && (
							<p className="text-xs text-red-600 dark:text-red-500 mt-2 opacity-75">
								Error ID: {error.digest}
							</p>
						)}
					</div>
				)}

				{/* Actions */}
				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Button onClick={reset} className="w-full sm:w-auto gap-2">
						<RefreshCw className="w-4 h-4" />
						Try Again
					</Button>
					<Link href="/">
						<Button variant="outline" className="w-full sm:w-auto gap-2">
							<Home className="w-4 h-4" />
							Back Home
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
