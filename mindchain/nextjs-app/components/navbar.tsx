"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Album,
  Bot,
  CircleCheck,
  Files,
  Globe,
  Home,
  Layers,
  Menu,
  X,
} from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const routes = [
    { href: "/", icon: <Home className="w-4" />, label: "Home" },
    { href: "/chat", icon: <Bot className="w-4" />, label: "AI Chat" },
    { href: "/documents", icon: <Files className="w-4" />, label: "Documents" },
    { href: "/community", icon: <Globe className="w-4" />, label: "Community" },
    { href: "/check", icon: <CircleCheck className="w-4" />, label: "Quiz" },
    { href: "/journal", icon: <Album className="w-4" />, label: "Journal" },
    {
      href: "/dashboard",
      icon: <Layers className="w-4" />,
      label: "Dashboard",
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full ${
        scrolled
          ? "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : ""
      }`}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="logo" width={40} height={40} />
            <span className="text-lg font-bold ml-1">MindChain</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-xs font-medium transition-colors hover:text-primary flex items-center justify-center gap-2 ${
                pathname === route.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}>
              {route.icon}
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden border-b">
          <div className="container py-4 flex flex-col gap-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === route.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setIsOpen(false)}>
                {route.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Button variant="outline" onClick={logout} className="w-full">
                Logout
              </Button>
            ) : (
              <Button asChild className="w-full">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
