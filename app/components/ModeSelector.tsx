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
                className={`p-3 rounded-full bg-white border border-stone-200 shadow-sm transition-all hover:bg-stone-50 
                  ${isActive ? `shadow-md ring-2 ring-offset-2 ring-offset-[#FAFAF9] ${mode.color.replace("text", "ring")} bg-stone-50 scale-110` : "hover:scale-105"}
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
