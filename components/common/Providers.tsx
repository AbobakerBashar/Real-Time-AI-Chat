import QueryProvider from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";

export default function Providers({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<ThemeProvider>
			<QueryProvider>{children}</QueryProvider>
		</ThemeProvider>
	);
}
