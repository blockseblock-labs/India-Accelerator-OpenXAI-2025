"use client";

import * as React from "react";

export type ChatMessage = {
	role: "user" | "assistant" | "system";
	content: string;
};

export function MessageBubble({ message }: { message: ChatMessage }) {
	const isUser = message.role === "user";
	return (
		<div className={isUser ? "flex justify-end" : "flex justify-start"}>
			<div
				className={
					"max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-soft " +
					(isUser
						? "bg-emerald-50 text-slate-900 border border-emerald-100"
						: "bg-white text-slate-900 border border-slate-200")
				}
			>
				{message.content}
			</div>
		</div>
	);
}


