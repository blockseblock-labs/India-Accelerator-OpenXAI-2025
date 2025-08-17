import React from "react";

export default function FloatingEmojis(): JSX.Element {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top Left */}
      <span className="absolute top-5 left-5 text-4xl animate-float">✨</span>

      {/* Top Right */}
      <span className="absolute top-10 right-10 text-4xl animate-float">🚀</span>

      {/* Bottom Left */}

      {/* Bottom Right */}
    </div>
  );
}
