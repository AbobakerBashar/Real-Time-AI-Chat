export interface NotificationInput {
	message: string;
	type: string;
	title: string;
	entity_id?: string;
	entity_type?: string;
	user_id: string;
}
