"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-orange-50 pointer-events-none" />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}>
        <Heart
          className="text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.3)]"
          size={40}
          fill="currentColor"
        />
      </motion.div>
    </div>
  );
}
