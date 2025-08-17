"use client";

import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import InteractiveSection from "@/components/InteractiveSection";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/simulation"); // redirects to simulation page
  };

  return (
    <>
      <Hero onStart={handleStart} />
      <Features />
      <InteractiveSection />
    </>
  );
}
