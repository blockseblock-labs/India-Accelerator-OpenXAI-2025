"use client";

import * as React from "react";
import { MessageBubble, type ChatMessage } from "./MessageBubble";

export function ChatContainer({ messages }: { messages: ChatMessage[] }) {
	const containerRef = React.useRef<HTMLDivElement | null>(null);

	React.useEffect(() => {
		containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
	}, [messages]);

	return (
		<div
			ref={containerRef}
			className="h-[60vh] sm:h-[65vh] overflow-y-auto px-4 py-6 space-y-4 bg-[rgba(255,255,255,0.6)] rounded-2xl"
		>
			{messages.length === 0 ? (
				<div className="h-full grid place-items-center text-center text-slate-500">
					<div>
						<p className="text-base">Start a calming conversation</p>
						<p className="text-sm">Ask anything. Your llama is listening.</p>
					</div>
				</div>
			) : (
				<div className="space-y-4">
					{messages.map((m, i) => (
						<MessageBubble key={i} message={m} />
					))}
				</div>
			)}
		</div>
	);
}


