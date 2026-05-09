"use client";
import { useGetMessages } from "@/hooks/useMesssages";
import { formatTime } from "@/utils/formatTime";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";

const messageVariants = {
	hidden: { opacity: 0, y: 20, scale: 0.8 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.3,
		},
	},
	exit: { opacity: 0, y: -10 },
};

const MessagesContainer = ({ roomId }: { roomId: string }) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { data: messages, isLoading: isLoading } = useGetMessages(roomId);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const isAI = messages && messages.length > 0 ? messages[0].is_ai : false;

	return (
		<div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 flex flex-col">
			<div className="max-w-4xl w-full mx-auto flex-1 flex flex-col space-y-4">
				<AnimatePresence>
					{!isLoading &&
						messages &&
						messages.map((message) => (
							<motion.div
								key={message.id}
								variants={messageVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								className={`flex ${!isAI ? "justify-end" : "justify-start"}`}
							>
								<motion.div
									whileHover={{ scale: 1.02 }}
									className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
										!isAI
											? "bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-br-none"
											: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"
									}`}
								>
									<p className="text-sm md:text-base">{message.content}</p>
									<p
										className={`text-xs mt-1.5 ${
											!isAI
												? "text-blue-100"
												: "text-gray-500 dark:text-gray-400"
										}`}
									>
										{formatTime(message.created_at || "")}
									</p>
								</motion.div>
							</motion.div>
						))}
				</AnimatePresence>

				{isLoading && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="flex justify-start"
					>
						<div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
							>
								<Loader className="w-4 h-4 text-gray-600 dark:text-gray-400" />
							</motion.div>
							<span className="text-sm text-gray-600 dark:text-gray-400">
								{isAI ? "Loading AI response..." : "Loading messages..."}
							</span>
						</div>
					</motion.div>
				)}

				<div ref={messagesEndRef} />
			</div>
		</div>
	);
};

export default MessagesContainer;
