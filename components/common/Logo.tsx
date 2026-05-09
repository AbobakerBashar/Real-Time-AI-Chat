// import Image from "next/image";

const Logo = () => {
	return (
		<div className="flex items-center gap-3 font-semibold text-xl">
			<div className="relative w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
				<div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
				<div className="absolute inset-0 rounded-full blur-lg bg-primary/40" />
			</div>

			<span className="text-foreground">ChatAI</span>
		</div>
	);
};

export default Logo;
