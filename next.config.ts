import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "puxgzgbtjxevbzheuazc.supabase.co",
			},
		],
	},
	reactCompiler: true,
};

export default nextConfig;
