import Link from "next/link";
import Logo from "../common/Logo";

const Footer = () => {
	return (
		<footer className="px-4 sm:px-6 lg:px-8 py-12 border-t border-border">
			<div className="max-w-6xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
					<div className="space-y-2">
						<Logo />
						<p className="text-zinc-400 text-sm">
							Real-time conversations powered by AI
						</p>
					</div>
					<div>
						<h4 className="text-foreground font-semibold mb-4">Product</h4>
						<ul className="space-y-2 text-sm text-zinc-400">
							<li>
								<Link
									href="/features"
									className="hover:text-secondary transition"
								>
									Features
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="text-foreground font-semibold mb-4">Company</h4>
						<ul className="space-y-2 text-sm text-zinc-400">
							<li>
								<Link href="/about" className="hover:text-secondary transition">
									About
								</Link>
							</li>

							<li>
								<Link
									href="/contact"
									className="hover:text-secondary transition"
								>
									Contact
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-border-border pt-8 flex flex-col sm:flex-row items-center justify-between">
					<p className="text-zinc-500 text-sm mb-4 sm:mb-0">
						© 2026 AI Chat. All rights reserved.
					</p>
					<div className="flex gap-4 text-zinc-400">
						<a href="#" className="hover:text-white transition">
							Twitter
						</a>
						<a
							href="https://github.com/AbobakerBashar"
							target="blank"
							className="hover:text-white transition"
						>
							GitHub
						</a>
						<a href="#" className="hover:text-white transition">
							LinkedIn
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
