import Link from "next/link";
import { Github, Twitter } from "lucide-react";
import { ModeToggle } from "./theme-mode";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-10">
      <div className="container flex items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col md:gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold">MindChain</span>
          </Link>
          <p className="text-center text-xs text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} MindChain. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4 items-center justify-center">
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-primary">
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-primary">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </footer>
  );
}
