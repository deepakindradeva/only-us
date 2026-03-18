"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MODES, ChatMode } from "../config/modes";

interface ModeSelectorProps {
  show: boolean;
  activeMode: ChatMode;
  onSelect: (mode: ChatMode) => void;
}

export default function ModeSelector({
  show,
  activeMode,
  onSelect,
}: ModeSelectorProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex justify-center gap-4 mb-4"
          onClick={(e) => e.stopPropagation()}>
          {Object.values(MODES).map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode.id === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => onSelect(mode)}
                className={`p-3 rounded-full bg-white/5 border border-white/10 transition-all hover:bg-white/10 
                  ${isActive ? `shadow-[0_0_20px_rgba(255,255,255,0.1)] ring-2 ring-offset-2 ring-offset-[#0a0a0c] ${mode.color.replace("text", "ring")} bg-white/15 scale-110` : "hover:scale-105"}
                `}
                title={mode.name}>
                <Icon className={mode.color} size={20} />
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
