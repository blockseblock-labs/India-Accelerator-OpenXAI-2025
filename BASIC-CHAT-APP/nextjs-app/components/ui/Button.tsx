"use client";

import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "primary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
	const base = "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50";
	const variants = {
		primary:
			"bg-accent text-white shadow-soft hover:bg-emerald-700 focus:ring-accent/30",
		ghost:
			"bg-transparent text-foreground hover:bg-emerald-50 border border-slate-200",
	};
	return (
		<button className={[base, variants[variant], className].filter(Boolean).join(" ")} {...props} />
	);
}


