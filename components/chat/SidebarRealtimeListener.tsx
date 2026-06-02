"use client";

import { useSidebarRealtime } from "@/hooks/useSidebarRealtime";

export default function SidebarRealtimeListener() {
	useSidebarRealtime();
	return null;
}
