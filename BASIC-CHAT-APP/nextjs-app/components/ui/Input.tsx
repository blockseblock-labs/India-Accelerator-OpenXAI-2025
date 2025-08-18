"use client";

import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
};

export function Input({ className, label, ...props }: InputProps) {
	return (
		<label className="block">
			{label && (
				<span className="mb-1 block text-sm font-medium text-slate-700">
					{label}
				</span>
			)}
			<input
				className={
					"w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] shadow-soft placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 disabled:opacity-50 " +
					(className ?? "")
				}
				{...props}
			/>
		</label>
	);
}


