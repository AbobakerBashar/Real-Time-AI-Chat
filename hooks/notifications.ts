import { addNotification } from "@/actions/notifications";
import { NotificationInput } from "@/types/notifications";
import { useMutation } from "@tanstack/react-query";

export const useAddNotification = () => {
	return useMutation({
		mutationFn: async (notification: NotificationInput) =>
			await addNotification(notification),
	});
};
