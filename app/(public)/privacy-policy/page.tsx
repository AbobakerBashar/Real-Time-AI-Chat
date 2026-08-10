import React from "react";

export const metadata = {
	title: "Privacy Policy - AI Chat",
	description:
		"Read our privacy policy to understand how we collect, use, and protect your information.",
};

const PrivacyPolicyPage = () => {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 px-4 sm:px-6 lg:px-8">
			<section className="py-16 lg:py-24">
				<div className="max-w-3xl mx-auto">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
						Privacy Policy
					</h1>
					<p className="mt-4 text-zinc-600 dark:text-zinc-300">
						Last updated: {new Date().toLocaleDateString()}
					</p>

					<div className="mt-10 space-y-6 text-zinc-700 dark:text-zinc-200">
						<div>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								1. Overview
							</h2>
							<p className="mt-2">
								AI Chat (“we”, “us”, “our”) is committed to protecting your
								privacy. This Privacy Policy explains how we collect, use, and
								safeguard information when you use our services.
							</p>
						</div>

						<div>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								2. Information We Collect
							</h2>
							<p className="mt-2">
								We may collect information you provide directly (e.g., account
								details) and information generated through your use of the
								service (e.g., chat messages and metadata needed to deliver the
								experience).
							</p>
						</div>

						<div>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								3. How We Use Information
							</h2>
							<p className="mt-2">
								We use collected information to provide, maintain, and improve
								the service; to understand usage; and to help ensure safety and
								security.
							</p>
						</div>

						<div>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								4. Data Sharing
							</h2>
							<p className="mt-2">
								We do not sell your personal information. We may share
								information with service providers who help us operate the
								service, or when required by law.
							</p>
						</div>

						<div>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								5. Security
							</h2>
							<p className="mt-2">
								We use appropriate technical and organizational measures
								designed to protect information. No method of transmission or
								storage is 100% secure, however.
							</p>
						</div>

						<div>
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								6. Contact Us
							</h2>
							<p className="mt-2">
								If you have questions about this Privacy Policy, contact us
								through the form on our Contact page.
							</p>
						</div>

						<p className="text-sm text-zinc-500 dark:text-zinc-400">
							This is a sample privacy policy. Replace this text with your
							actual legal terms.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
};

export default PrivacyPolicyPage;
