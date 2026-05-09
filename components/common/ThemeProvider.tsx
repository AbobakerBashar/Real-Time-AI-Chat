"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const [theme, setTheme] = useState<Theme>("dark");

	useEffect(() => {
		// Get theme from localStorage or system preference
		const storedTheme = localStorage.getItem("theme") as Theme | null;
		if (storedTheme) {
			setTheme(storedTheme);
			applyTheme(storedTheme);
		} else {
			const prefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches;
			const initialTheme = prefersDark ? "dark" : "light";
			setTheme(initialTheme);
			applyTheme(initialTheme);
		}
	}, []);

	const applyTheme = (newTheme: Theme) => {
		const root = document.documentElement;
		if (newTheme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
	};

	const toggleTheme = () => {
		setTheme((prevTheme) => {
			const newTheme = prevTheme === "dark" ? "light" : "dark";
			localStorage.setItem("theme", newTheme);
			applyTheme(newTheme);
			return newTheme;
		});
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
