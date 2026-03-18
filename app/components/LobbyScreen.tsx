"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { motion } from "framer-motion";

interface LobbyScreenProps {
  user: any;
  profile: any;
  myPairingCode: string | null;
  pairWithPartner: (code: string) => Promise<void>;
}

export function LobbyScreen({
  user,
  profile,
  myPairingCode,
  pairWithPartner,
}: LobbyScreenProps) {
  const [partnerCodeInput, setPartnerCodeInput] = useState("");
  const [isPairing, setIsPairing] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0c] text-slate-200 p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-pink-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full z-10 space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="w-20 h-20 rounded-full shadow-lg border-2 border-white/10 mb-3 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-2xl font-playfair italic shadow-lg mb-3">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
            </div>
          )}
          <p className="text-lg font-medium text-white">
            {profile?.full_name}
          </p>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>

        <div className="text-center space-y-2 pt-4 border-t border-white/10">
          <h2 className="text-3xl font-playfair italic text-white">
            Find Your Partner
          </h2>
          <p className="text-slate-400 text-sm font-inter">
            Share your code or enter theirs to connect.
          </p>
        </div>

        <div className="space-y-6">
          {/* My Code Section */}
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider">
              Your Pairing Code
            </p>
            <p className="text-3xl font-mono tracking-[0.25em] text-pink-300">
              {myPairingCode}
            </p>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase tracking-wider">
              OR
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* Enter Partner Code */}
          <div className="space-y-3">
            <p className="text-xs text-slate-500 uppercase tracking-wider text-center">
              Enter Partner&apos;s Code
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={partnerCodeInput}
                onChange={(e) =>
                  setPartnerCodeInput(e.target.value.toUpperCase())
                }
                placeholder="e.g. X9Y8Z7"
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-center font-mono text-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-pink-500/50 transition-colors"
                maxLength={6}
              />
            </div>
            <button
              onClick={async () => {
                setIsPairing(true);
                try {
                  await pairWithPartner(partnerCodeInput);
                } catch {
                  alert(
                    "Failed to connect. Please check the code and try again.",
                  );
                } finally {
                  setIsPairing(false);
                }
              }}
              disabled={partnerCodeInput.length < 6 || isPairing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500/80 to-purple-500/80 hover:from-pink-500 hover:to-purple-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isPairing ? "Connecting..." : "Connect"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
