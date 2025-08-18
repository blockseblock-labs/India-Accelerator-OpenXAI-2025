"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

type ChatComposerProps = {
	value: string;
	onChange: (value: string) => void;
	onSend: () => void;
	disabled?: boolean;
};

export function ChatComposer({ value, onChange, onSend, disabled }: ChatComposerProps) {
	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			onSend();
		}
	};

	return (
		<div className="flex items-center gap-2 p-3">
			<input
				className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] shadow-soft placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 disabled:opacity-50"
				placeholder="Type your message..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={onKeyDown}
				disabled={disabled}
			/>
			<Button onClick={onSend} disabled={disabled} aria-label="Send">
				Send
			</Button>
		</div>
	);
}


