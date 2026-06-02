import { Loader2 } from "lucide-react";

export default function LoadingRoomChatUI() {
	return (
		<div className="h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:bg-linear-to-br dark:from-gray-950 dark:via-gray-900 dark:to-black transition-colors duration-300 flex flex-col md:flex-row">
			{/* Sidebar */}
			<div className="hidden md:block md:w-80 md:fixed md:left-0 md:top-0 md:h-screen md:z-40">
				<div className="h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800" />
			</div>

			{/* Main Chat Area */}
			<div className="flex-1 flex flex-col overflow-hidden w-full md:ml-80">
				<div className="h-16 md:h-20 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/60" />

				<div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4">
					<div className="max-w-4xl w-full mx-auto flex flex-col gap-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="flex gap-2 items-end">
								<div
									className={`w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${
										i % 2 === 0 ? "ml-auto" : ""
									}`}
								/>
								<div
									className={`h-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${
										i % 2 === 0 ? "w-3/5 ml-auto" : "w-2/5"
									}`}
								/>
							</div>
						))}

						<div className="mt-6 flex items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-300">
							<Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
							Loading room...
						</div>
					</div>
				</div>

				<div className="border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/60">
					<div className="max-w-4xl mx-auto px-6 py-4">
						<div className="flex gap-3">
							<div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
							<div className="flex-1 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
							<div className="w-14 h-10 rounded-lg bg-indigo-600/20 dark:bg-indigo-500/20 border border-indigo-600/30 dark:border-indigo-500/30" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
