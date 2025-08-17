export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "AI Chat Assistant",
  description: "A modern AI chat application powered by Ollama and built with Next.js for OpenXAI",
  url: "https://openxai.org",
  ogImage: "https://openxai.org/og.jpg",
  links: {
    twitter: "https://twitter.com/openxai",
    github: "https://github.com/openxai",
  },
} as const;
