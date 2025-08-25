import { ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import Link from "next/link";

export function AnimatedShinyTextDemo() {
  return (
    <Link href="/calmly">
      <div className="z-10 flex items-center justify-center">
        <div
          className={cn(
            "group rounded-full border border-white/5 bg-neutral-900 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-800",
          )}
        >
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 text-neutral-500 transition ease-out hover:text-neutral-400 hover:duration-300">
            <span>✨ Try Calmly Breathing Excercises </span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
      </div>
    </Link>
  );
}
