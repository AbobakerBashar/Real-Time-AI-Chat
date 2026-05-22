import { Suspense } from "react";
import SearchBar from "./SearchBar";
import SidebarContainer from "./SidebarContainer";
// import SidebarFooter from "./SidebarFooter";
import SidebarHeader from "./SidebarHeader";
import SidebarChatPanel from "./SidebarChatPanel";

const Sidebar = ({ isMobile = false }: { isMobile?: boolean }) => {
	return (
		<>
			<aside
				className={`${
					isMobile ? "h-full w-full" : "h-screen w-80 fixed left-0 top-0 z-40"
				}`}
			>
				{/* Glassmorphism Background */}
				<div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-gray-100 dark:bg-linear-to-br dark:from-gray-950/80 dark:via-gray-900/70 dark:to-black/80 backdrop-blur-xl border-r border-gray-200 dark:border-white/5" />

				{/* Darker background layer */}
				<div className="absolute inset-0 bg-black/0 dark:bg-black/40" />

				{/* Content */}
				<Suspense>
					<SidebarContainer>
						{/* Header Section with Logo */}
						<SidebarHeader />
						{/* Search Bar */}
						<SearchBar />
						{/* Conversations List */}
						<SidebarChatPanel />
						{/* Footer Section */}
						{/* <SidebarFooter /> */}
					</SidebarContainer>
				</Suspense>
			</aside>
		</>
	);
};

export default Sidebar;
