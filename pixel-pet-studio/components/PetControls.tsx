"use client";

import { Button } from "@/components/ui/button";

type Props = {
  onAction: (action: string) => void;
};

export default function PetControls({ onAction }: Props) {
  return (
    <div className="mt-4 flex gap-2 flex-wrap justify-center">
      <Button onClick={() => onAction("feed")}>🍖 Feed</Button>
      <Button onClick={() => onAction("drink")}>🥤 Drink</Button>
      <Button onClick={() => onAction("play")}>🎾 Play</Button>
      <Button onClick={() => onAction("sleep")}>😴 Sleep</Button>
    </div>
  );
}
