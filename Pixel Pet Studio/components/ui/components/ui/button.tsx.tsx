import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "px-6 py-2 rounded-xl font-semibold transition-all duration-150",
        "focus:outline-none active:scale-95",
        variant === "default" &&
          "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:opacity-90",
        variant === "outline" &&
          "border border-white/30 bg-white/5 text-white hover:bg-white/10",
        variant === "ghost" && "text-white/80 hover:text-white",
        className
      )}
      {...props}
    />
  );
}
