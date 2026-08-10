import React from "react";

export const metadata = {
	title: "Terms of Service - AI Chat",
	description:
		"Review our Terms of Service to understand your rights and obligations when using AI Chat.",
};

const TermsOfServicePage = () => {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 px-4 sm:px-6 lg:px-8">
			<section className="py-16 lg:py-24">
				<div className="max-w-3xl mx-auto">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
						Terms of Service
					</h1>
					<p className="mt-4 text-zinc-600 dark:text-zinc-300">
						Last updated: {new Date().toLocaleDateString()}
					</p>

					<div className="mt-10 space-y-6 text-zinc-700 dark:text-zinc-200">
						<div>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								1. Acceptance of Terms
							</h2>
							<p className="mt-2">
								By accessing or using the AI Chat service, you agree to be bound
								by these Terms of Service.
							</p>
						</div>

						<div>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								2. Use of the Service
							</h2>
							<p className="mt-2">
								You agree to use the service in compliance with applicable laws
								and not to interfere with or misuse the service.
							</p>
						</div>

						<div>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								3. Content
							</h2>
							<p className="mt-2">
								You are responsible for the content you submit. We may remove or
								modify content that violates these terms or harms the service.
							</p>
						</div>

						<div>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								4. Termination
							</h2>
							<p className="mt-2">
								We may suspend or terminate your access if you violate these
								Terms of Service or if we reasonably believe your use creates
								risk.
							</p>
						</div>

						<div>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								5. Disclaimer
							</h2>
							<p className="mt-2">
								The service is provided “as is” and “as available”. To the
								maximum extent permitted by law, we disclaim all warranties.
							</p>
						</div>

						<div>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								6. Contact
							</h2>
							<p className="mt-2">
								For questions about these Terms of Service, contact us via the
								form on our Contact page.
							</p>
						</div>

						<p className="text-sm text-zinc-500 dark:text-zinc-400">
							This is a sample terms of service. Replace this text with your
							actual legal terms.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
};

export default TermsOfServicePage;
