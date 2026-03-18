"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ModeId } from "../config/modes";

export interface MessageProps {
  id: string | number;
  text: string;
  originalText?: string | null;
  sender: "me" | "partner";
  mode: ModeId;
}

export default function MessageBubble({ message }: { message: MessageProps }) {
  const isMe = message.sender === "me";

  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        className={`max-w-[85%] rounded-3xl p-4 md:px-6 shadow-xl backdrop-blur-md border transition-colors
          ${
            isMe
              ? "bg-gradient-to-br from-pink-500/15 to-purple-500/15 border-pink-500/20 rounded-br-sm text-pink-50"
              : "bg-gradient-to-br from-white/10 to-white/5 border-white/10 rounded-bl-sm text-slate-200"
          }
        `}>
        {message.mode === "mystery" ? (
          <MysteryText text={message.text} />
        ) : (
          <p
            className={`${message.mode === "poetry" ? "font-playfair italic text-lg" : "font-inter text-sm"}`}>
            {message.text}
          </p>
        )}
      </motion.div>

      {/* The "Transformed from" context tag */}
      {message.originalText && (
        <p className="text-[10px] text-slate-500/80 mt-1.5 max-w-[70%] italic px-2">
          ✨ Transformed from: &quot;{message.originalText}&quot;
        </p>
      )}
    </div>
  );
}

// Keeping the mystery logic encapsulated inside the bubble component
function MysteryText({ text }: { text: string }) {
  const [revealed, setRevealed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setRevealed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="font-mono text-indigo-200">
      {revealed}
      <span className="animate-pulse">|</span>
    </p>
  );
}
