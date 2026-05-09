import AuthComponent from "@/components/publick/AuthComponent";

export const metadata = {
	title: "Auth - ChatAI",
	description: "Login or Signup to access ChatAI features",
};

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return <AuthComponent>{children}</AuthComponent>;
};

export default AuthLayout;
