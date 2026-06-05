import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "puxgzgbtjxevbzheuazc.supabase.co",
			},
			{
				protocol: "https",
				hostname: "via.placeholder.com",
			},
		],
	},
	reactCompiler: true,
};

export default nextConfig;
