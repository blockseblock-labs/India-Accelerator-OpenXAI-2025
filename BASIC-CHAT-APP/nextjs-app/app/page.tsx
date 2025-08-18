"use client";
import dynamic from "next/dynamic";
const Chat = dynamic(() => import("@/components/chat").then(mod => mod.Chat), {
  ssr: false,
});
export default function Home() {
  return <Chat />;
}
