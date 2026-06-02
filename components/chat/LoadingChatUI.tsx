import { Loader2 } from "lucide-react";

export default function LoadingChatUI({ message }: { message: string }) {
	return (
		<div className="h-screen absolute top-0 left-0 right-0 w-full bg-white dark:bg-gray-950 transition-colors duration-300 flex flex-col md:flex-row">
			<div className="hidden md:flex md:w-80 md:shrink-0">
				<div className="w-full h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800" />
			</div>

			<div className="flex-1 flex flex-col overflow-hidden w-full bg-linear-to-br from-gray-50 via-white to-gray-100 dark:bg-linear-to-br dark:from-gray-950 dark:via-gray-900 dark:to-black">
				<div className="flex-1 flex items-center justify-center px-6">
					<div className="flex flex-col items-center gap-3">
						<div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
							<Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-300">
							{message}...
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
