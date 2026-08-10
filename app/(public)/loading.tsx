import { Loader2 } from "lucide-react";

export default function Loading() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
			<div className="flex flex-col items-center space-y-6">
				<div className="relative">
					<div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-75 animate-pulse"></div>
					<Loader2 className="w-16 h-16 text-blue-600 dark:text-blue-400 animate-spin relative" />
				</div>
				<div className="text-center">
					<h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
						Loading...
					</h2>
					<p className="text-slate-600 dark:text-slate-400">
						We&apos;re preparing something amazing for you
					</p>
				</div>
			</div>
		</div>
	);
}
