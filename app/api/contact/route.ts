import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
	name: string;
	email: string;
	subject: string;
	message: string;
}

// Validate email format
function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

// Validate form data
function validateFormData(data: any): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	if (!data.name || data.name.trim().length === 0) {
		errors.push("Name is required");
	}
	if (data.name && data.name.length > 100) {
		errors.push("Name must be less than 100 characters");
	}

	if (!data.email || data.email.trim().length === 0) {
		errors.push("Email is required");
	}
	if (!isValidEmail(data.email)) {
		errors.push("Invalid email format");
	}

	if (!data.subject || data.subject.trim().length === 0) {
		errors.push("Subject is required");
	}
	if (data.subject && data.subject.length > 200) {
		errors.push("Subject must be less than 200 characters");
	}

	if (!data.message || data.message.trim().length === 0) {
		errors.push("Message is required");
	}
	if (data.message && data.message.length > 5000) {
		errors.push("Message must be less than 5000 characters");
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate form data
		const validation = validateFormData(body);
		if (!validation.valid) {
			return NextResponse.json(
				{ error: "Validation failed", errors: validation.errors },
				{ status: 400 },
			);
		}

		const formData: ContactFormData = {
			name: body.name.trim(),
			email: body.email.trim(),
			subject: body.subject.trim(),
			message: body.message.trim(),
		};

		// TODO: Implement sending email or saving to database
		// For now, we'll just log it and return success
		console.log("Contact form submission:", {
			...formData,
			timestamp: new Date().toISOString(),
		});

		// Optional: You can integrate email service here (e.g., Resend, SendGrid, etc.)
		// Or save to Supabase database

		return NextResponse.json(
			{
				success: true,
				message: "Thank you for contacting us. We will get back to you soon.",
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error("Contact form error:", error);
		return NextResponse.json(
			{ error: "Failed to process contact form" },
			{ status: 500 },
		);
	}
}
