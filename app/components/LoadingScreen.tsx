"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 pointer-events-none" />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}>
        <Heart
          className="text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]"
          size={40}
          fill="currentColor"
        />
      </motion.div>
    </div>
  );
}
