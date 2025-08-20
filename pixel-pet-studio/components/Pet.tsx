"use client";

import { motion } from "framer-motion";

export default function Pet() {
  return (
    <div className="flex flex-col items-center">
      <motion.img
        src="/pet.png" // make sure you add a pet.png in /public
        alt="Your Pet"
        className="w-40 h-40 object-contain"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      <p className="text-lg font-semibold mt-2">Your Virtual Pet</p>
    </div>
  );
}
