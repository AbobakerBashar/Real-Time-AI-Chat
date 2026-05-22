"use client";

import { motion } from "framer-motion";
import { CheckCircle, Send } from "lucide-react";
import { useState } from "react";

const formVariants = {
	hidden: { opacity: 0, x: 20 },
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.8,
			delay: 0.2,
		},
	},
};

const ContactForm = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate API call
		setTimeout(() => {
			setIsSubmitting(false);
			setSubmitted(true);
			setFormData({ name: "", email: "", subject: "", message: "" });

			// Reset submitted state after 5 seconds
			setTimeout(() => {
				setSubmitted(false);
			}, 5000);
		}, 1500);
	};

	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true }}
			variants={formVariants}
		>
			{submitted ? (
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					className="flex flex-col items-center justify-center p-8 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 h-full"
				>
					<CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mb-4" />
					<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
						Message Sent!
					</h3>
					<p className="text-gray-600 dark:text-gray-400 text-center">
						Thank you for reaching out. We&apos;ll get back to you soon.
					</p>
				</motion.div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Name Field */}
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
						>
							Full Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							placeholder="John Doe"
							className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
						/>
					</div>

					{/* Email Field */}
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
						>
							Email Address
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							placeholder="john@example.com"
							className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
						/>
					</div>

					{/* Subject Field */}
					<div>
						<label
							htmlFor="subject"
							className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
						>
							Subject
						</label>
						<input
							type="text"
							id="subject"
							name="subject"
							value={formData.subject}
							onChange={handleChange}
							required
							placeholder="How can we help?"
							className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
						/>
					</div>

					{/* Message Field */}
					<div>
						<label
							htmlFor="message"
							className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
						>
							Message
						</label>
						<textarea
							id="message"
							name="message"
							value={formData.message}
							onChange={handleChange}
							required
							rows={5}
							placeholder="Tell us more about your inquiry..."
							className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
						/>
					</div>

					{/* Submit Button */}
					<motion.button
						type="submit"
						disabled={isSubmitting}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition duration-300 flex items-center justify-center gap-2"
					>
						{isSubmitting ? (
							<>
								<div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
								Sending...
							</>
						) : (
							<>
								<Send className="w-5 h-5" />
								Send Message
							</>
						)}
					</motion.button>
				</form>
			)}
		</motion.div>
	);
};

export default ContactForm;
