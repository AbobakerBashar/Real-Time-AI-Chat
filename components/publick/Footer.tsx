import { MessageCircle } from "lucide-react";

const Footer = () => {
	return (
		<footer className="px-4 sm:px-6 lg:px-8 py-12 border-t border-zinc-800">
			<div className="max-w-6xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
					<div>
						<div className="flex items-center gap-2 mb-4">
							<MessageCircle className="w-5 h-5 text-blue-500" />
							<span className="font-bold text-white">AI Chat</span>
						</div>
						<p className="text-zinc-400 text-sm">
							Real-time conversations powered by AI
						</p>
					</div>
					<div>
						<h4 className="text-white font-semibold mb-4">Product</h4>
						<ul className="space-y-2 text-sm text-zinc-400">
							<li>
								<a href="#" className="hover:text-white transition">
									Features
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition">
									Pricing
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition">
									Security
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="text-white font-semibold mb-4">Company</h4>
						<ul className="space-y-2 text-sm text-zinc-400">
							<li>
								<a href="#" className="hover:text-white transition">
									About
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition">
									Blog
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition">
									Contact
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="text-white font-semibold mb-4">Legal</h4>
						<ul className="space-y-2 text-sm text-zinc-400">
							<li>
								<a href="#" className="hover:text-white transition">
									Privacy
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition">
									Terms
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row items-center justify-between">
					<p className="text-zinc-500 text-sm mb-4 sm:mb-0">
						© 2026 AI Chat. All rights reserved.
					</p>
					<div className="flex gap-4 text-zinc-400">
						<a href="#" className="hover:text-white transition">
							Twitter
						</a>
						<a href="#" className="hover:text-white transition">
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
