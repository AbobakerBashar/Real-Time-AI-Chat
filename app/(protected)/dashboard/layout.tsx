import DashboardHeader from "@/components/dashboard/Header";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black transition-colors duration-300">
			{/* Header */}
			<DashboardHeader />

			{/* Main Content with Sidebar */}
			<main className="flex-1">
				<div className="flex">
					{/* Sidebar - hidden on mobile/tablet, visible on desktop */}
					<aside className="hidden md:block w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950/50">
						<div className="sticky top-20 p-4">
							<DashboardSidebar />
						</div>
					</aside>

					{/* Main Content */}
					<div className="flex-1 px-4 md:px-6 py-6 md:py-8">
						<div className="max-w-6xl mx-auto">{children}</div>
					</div>
				</div>
			</main>
		</div>
	);
}
