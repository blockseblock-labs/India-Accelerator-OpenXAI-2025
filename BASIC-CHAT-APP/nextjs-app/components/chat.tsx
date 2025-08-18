"use client";

import * as React from "react";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { type ChatMessage } from "@/components/chat/MessageBubble";

export function Chat() {
	const [input, setInput] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);
	const [messages, setMessages] = React.useState<ChatMessage[]>([]);
	const [error, setError] = React.useState<string | null>(null);

	const sendMessage = async () => {
		const trimmed = input.trim();
		if (!trimmed || isLoading) return;
		setIsLoading(true);
		setError(null);
		setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
		setInput("");
		try {
			const res = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: trimmed }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to send message");
			setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
		} catch (e: any) {
			setError(e.message ?? "Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-4">
			{error && (
				<div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700 text-sm">
					{error}
				</div>
			)}
			<ChatContainer messages={messages} />
			<div className="border-t border-slate-200">
				<ChatComposer value={input} onChange={setInput} onSend={sendMessage} disabled={isLoading} />
			</div>
		</div>
	);
}
