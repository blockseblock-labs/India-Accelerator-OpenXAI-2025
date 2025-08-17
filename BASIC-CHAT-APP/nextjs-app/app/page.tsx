import { Chat } from "@/components/chat";
import { ThemeToggle } from "@/components/theme-toggle";
import React from "react";

export default function IndexPage() {
  return (
    <>
      <ThemeToggle />
      <Chat />
    </>
  );
}
