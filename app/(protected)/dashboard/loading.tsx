import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
	return (
		<div className="min-h-[60vh] flex items-center justify-center p-4">
			<div className="flex flex-col items-center gap-4">
				<div className="relative">
					<div className="absolute -inset-3 rounded-full bg-indigo-500/10 blur" />
					<Loader2 className="relative h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400" />
				</div>
				<div className="text-center">
					<p className="text-sm font-medium text-gray-700 dark:text-gray-200">
						Loading dashboard…
					</p>
					<p className="text-xs text-gray-500 dark:text-gray-400">
						Preparing your chats and settings.
					</p>
				</div>

				<div className="mt-2 w-full max-w-xl space-y-3">
					<div className="h-4 rounded bg-gray-200/70 dark:bg-gray-800/70 animate-pulse" />
					<div className="h-4 rounded bg-gray-200/70 dark:bg-gray-800/70 animate-pulse" />
					<div className="h-4 rounded bg-gray-200/70 dark:bg-gray-800/70 animate-pulse w-2/3" />
					<div className="h-36 rounded-xl bg-gray-200/60 dark:bg-gray-800/60 animate-pulse" />
				</div>
			</div>
		</div>
	);
}
