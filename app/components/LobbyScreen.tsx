"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Unlink } from "lucide-react";

interface LobbyScreenProps {
  user: any;
  profile: any;
  myPairingCode: string | null;
  pairWithPartner: (code: string) => Promise<void>;
  unpairedAlert?: boolean;
  setUnpairedAlert?: (val: boolean) => void;
}

export function LobbyScreen({
  user,
  profile,
  myPairingCode,
  pairWithPartner,
  unpairedAlert,
  setUnpairedAlert,
}: LobbyScreenProps) {
  const [partnerCodeInput, setPartnerCodeInput] = useState("");
  const [isPairing, setIsPairing] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF9] text-stone-800 p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-rose-200/40 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-orange-200/40 blur-[100px] rounded-full mix-blend-multiply pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full z-10 space-y-8 bg-white/70 p-8 rounded-3xl border border-stone-200 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col items-center mb-6">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="w-20 h-20 rounded-full shadow-md border-2 border-white mb-3 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-2xl font-playfair italic shadow-md mb-3 text-stone-600 border-2 border-white">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
            </div>
          )}
          <p className="text-lg font-medium text-stone-800">
            {profile?.full_name}
          </p>
          <p className="text-xs text-stone-500">{user.email}</p>
        </div>

        <div className="text-center space-y-2 pt-4 border-t border-stone-100">
          <h2 className="text-3xl font-playfair italic text-stone-800">
            Find Your Partner
          </h2>
          <p className="text-stone-500 text-sm font-inter">
            Share your code or enter theirs to connect.
          </p>
        </div>

        <div className="space-y-6">
          {/* My Code Section */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-center space-y-2 shadow-inner">
            <p className="text-xs text-stone-500 uppercase tracking-wider">
              Your Pairing Code
            </p>
            <p className="text-3xl font-mono tracking-[0.25em] text-rose-500 font-semibold">
              {myPairingCode}
            </p>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink-0 mx-4 text-stone-400 text-xs uppercase tracking-wider">
              OR
            </span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* Enter Partner Code */}
          <div className="space-y-3">
            <p className="text-xs text-stone-500 uppercase tracking-wider text-center">
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
                className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3 text-center font-mono text-lg text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all shadow-sm"
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
              {isPairing ? "Connecting..." : "Connect"}
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {unpairedAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-orange-400" />
              <div className="w-16 h-16 mx-auto bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-2 shadow-inner border border-rose-100">
                <Unlink size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-playfair italic text-stone-800">
                Disconnected
              </h3>
              <p className="text-stone-500 text-sm pb-2">
                Your partner has unpaired from this chat. You are now back in the lobby.
              </p>
              <button
                onClick={() => setUnpairedAlert?.(false)}
                className="w-full py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium transition-colors active:scale-95 duration-200">
                Okay
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
