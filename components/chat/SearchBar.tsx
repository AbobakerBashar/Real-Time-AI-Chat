"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchBar = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname(); // Good practice to use current path

	const [searchQuery, setSearchQuery] = useState(
		searchParams.get("search") ?? "",
	);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			const params = new URLSearchParams(searchParams);

			if (searchQuery) {
				params.set("search", searchQuery);
			} else {
				params.delete("search");
			}

			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		}, 300);

		return () => clearTimeout(timer);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchQuery, router, pathname]);

	return (
		<div className="px-3 py-4 border-b border-gray-200 dark:border-white/5">
			<div className="relative group">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:group-focus-within:text-indigo-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
				<input
					type="text"
					placeholder="Search conversations..."
					value={searchQuery}
					onChange={handleSearchChange}
					className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 focus:border-indigo-500 dark:focus:border-indigo-500/50 focus:bg-white dark:focus:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
					style={{ colorScheme: "light dark" }}
				/>
			</div>
		</div>
	);
};

export default SearchBar;
