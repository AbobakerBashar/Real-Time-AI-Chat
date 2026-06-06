import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SaveNotificationsSettingsButtonProps {
	settings: {
		autoSave: boolean;
		lowBandwidth: boolean;
		compactMode: boolean;
		soundEnabled: boolean;
		notificationsEnabled: boolean;
	};
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const SaveSettingsButton = ({
	settings,
}: SaveNotificationsSettingsButtonProps) => {
	const handleSaveSettings = () => {
		// Save settings to localStorage or backend
		localStorage.setItem("appSettings", JSON.stringify(settings));
		toast.success("Settings saved successfully!");
	};

	return (
		<motion.div variants={itemVariants} className="flex gap-2">
			<Button
				onClick={handleSaveSettings}
				size="lg"
				className="flex-1 md:flex-none"
			>
				Save Settings
			</Button>
			<Button variant="outline" size="lg">
				Reset to Defaults
			</Button>
		</motion.div>
	);
};

export default SaveSettingsButton;
