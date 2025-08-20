import { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: "/icon.png",
		shortcut: "/icon.png",
		apple: "/icon.png",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className="min-h-screen antialiased bg-background text-foreground">
				<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
					<header className="mb-6">
						<h1 className="text-xl font-semibold tracking-tight">{siteConfig.name}</h1>
						<p className="text-sm text-slate-600">{siteConfig.description}</p>
					</header>
					<main className="bg-white rounded-2xl shadow-soft border border-slate-200">
						{children}
					</main>
				</div>
			</body>
		</html>
	);
}
