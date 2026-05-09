"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendMessage } from "@/hooks/useMesssages";
import { motion } from "framer-motion";
import { Loader, Plus, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const inputAreaVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			delay: 0.2,
		},
	},
};

const InputArea = ({ roomId }: { roomId: string }) => {
	const [inputValue, setInputValue] = useState("");
	const { mutateAsync: sendMessage, isPending: isSendingMessage } =
		useSendMessage();

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputValue.trim()) return;
		const result = await sendMessage({
			content: inputValue,
			roomId,
		});
		if (result.success) {
			setInputValue("");
		} else {
			console.error("Failed to send message:", result.error);
		}
	};

	return (
		<motion.div
			variants={inputAreaVariants}
			initial="hidden"
			animate="visible"
			className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 transition-colors duration-300 shrink-0 h-26"
		>
			<div className="max-w-4xl mx-auto px-6">
				<form onSubmit={handleSendMessage} className="flex gap-3">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="hover:bg-gray-100 dark:hover:bg-gray-800"
						onClick={() => toast.info("Attachment feature coming soon!")}
					>
						<Plus className="w-5 h-5" />
					</Button>

					<Input
						type="text"
						placeholder="Type your message..."
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						disabled={isSendingMessage}
						className="flex-1 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
					/>

					<Button
						type="submit"
						disabled={isSendingMessage || !inputValue.trim()}
						className="bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white px-6"
					>
						{isSendingMessage ? (
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
							>
								<Loader className="w-4 h-4" />
							</motion.div>
						) : (
							<Send className="w-4 h-4" />
						)}
					</Button>
				</form>

				<p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
					✨ Powered by advanced AI • Your conversations are private & secure
				</p>
			</div>
		</motion.div>
	);
};

export default InputArea;
