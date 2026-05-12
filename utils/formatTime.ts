export const formatTime = (date: string) => {
	return new Date(date).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
};

export const getTimeAgo = (dateString: string | null) => {
	if (!dateString) return "";
	const date = new Date(dateString);
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor(diff / (1000 * 60));
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (minutes < 1) return "just now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	if (days < 7) return `${days}d ago`;
	return date.toLocaleDateString();
};
