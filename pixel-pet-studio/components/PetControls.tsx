"use client";

import { Button } from "@/components/ui/button";
import { Smile, Utensils, Droplet } from "lucide-react";

export default function PetControls() {
  return (
    <div className="flex gap-4 justify-center mt-4">
      <Button variant="outline">
        <Utensils className="mr-2 h-4 w-4" /> Feed
      </Button>
      <Button variant="outline">
        <Droplet className="mr-2 h-4 w-4" /> Drink
      </Button>
      <Button variant="outline">
        <Smile className="mr-2 h-4 w-4" /> Play
      </Button>
    </div>
  );
}
