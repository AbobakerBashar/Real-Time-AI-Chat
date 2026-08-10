import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

export const metadata = {
	title: "404 - Page Not Found",
	description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4">
			<div className="max-w-md w-full text-center">
				{/* Icon */}
				<div className="mb-8 flex justify-center">
					<div className="relative">
						<div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl"></div>
						<AlertCircle className="w-20 h-20 text-red-600 dark:text-red-400 relative" />
					</div>
				</div>

				{/* Content */}
				<h1 className="text-6xl font-bold text-slate-900 dark:text-slate-50 mb-2">
					404
				</h1>
				<h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
					Page Not Found
				</h2>
				<p className="text-slate-600 dark:text-slate-400 mb-8">
					Sorry, the page you&apos;re looking for doesn&apos;t exist. It might
					have been moved or deleted.
				</p>

				{/* Actions */}
				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Link href="/">
						<Button className="w-full sm:w-auto gap-2">
							<Home className="w-4 h-4" />
							Back Home
						</Button>
					</Link>
					<Button
						variant="outline"
						className="w-full sm:w-auto gap-2"
						onClick={() => window.history.back()}
					>
						<ArrowLeft className="w-4 h-4" />
						Go Back
					</Button>
				</div>
			</div>
		</div>
	);
}
