"use client";

import { useState, useRef, useEffect } from "react";
import { Send, LogOut, Heart, Users, Unlink } from "lucide-react";
import { motion } from "framer-motion";
import { useChat } from "./hooks/useChat";
import MessageBubble from "./components/MessageBubble";
import ModeSelector from "./components/ModeSelector";
import { signInWithGoogle, signOut } from "./services/authService";

export default function OnlyUsApp() {
  const {
    user,
    profile,
    partnerProfile,
    isLoading,
    messages,
    inputText,
    setInputText,
    activeMode,
    setActiveMode,
    sendMessage,
    isPaired,
    myPairingCode,
    pairWithPartner,
    disconnectPartner,
  } = useChat();
  const [showModes, setShowModes] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [partnerCodeInput, setPartnerCodeInput] = useState("");
  const [isPairing, setIsPairing] = useState(false);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 1. LOADING STATE: Checking session
  if (isLoading) {
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

  // 2. LOGIN SCREEN: Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0c] text-slate-200 p-4 relative overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-pink-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-10 max-w-sm w-full z-10">
          <div className="space-y-4">
            <h1 className="text-6xl font-playfair italic tracking-wider bg-clip-text text-transparent bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 drop-shadow-sm">
              Only Us
            </h1>
            <p className="text-slate-400 font-inter text-sm tracking-[0.2em] uppercase">
              Your private space
            </p>
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-3 font-inter font-medium shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.05)] hover:-translate-y-1">
            {/* Simple Google G icon */}
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  // 3. LOBBY SCREEN: Authenticated, but no partner paired yet
  if (!isPaired) {
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
                Enter Partner's Code
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
                  } catch (err) {
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

  // 4. MAIN CHAT: Authenticated and Paired
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0a0c]">
      {/* Ambient Chat Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      {/* Header */}
      <header className="p-4 md:p-6 border-b border-white/5 bg-white/[0.02] backdrop-blur-xl z-20 flex justify-between items-center sticky top-0">
        {/* Partner Info */}
        <div className="flex items-center gap-3">
          {partnerProfile ? (
            <>
              {partnerProfile.avatar_url ? (
                <img
                  src={partnerProfile.avatar_url}
                  alt="Partner"
                  className="w-10 h-10 rounded-full border border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)] object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-200 flex items-center justify-center font-playfair italic border border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                  {partnerProfile.full_name?.charAt(0)}
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">
                  {partnerProfile.full_name}
                </p>
                <p className="text-xs text-pink-400">Partner</p>
              </div>
            </>
          ) : (
            <div className="w-10" />
          )}
        </div>

        <h1 className="text-center text-2xl font-playfair italic tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-indigo-200 absolute left-1/2 -translate-x-1/2">
          Only Us
        </h1>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="items-center gap-2 text-right hidden lg:flex mr-2">
            <div>
              <p className="text-sm font-medium text-white">
                {profile?.full_name}
              </p>
              <p className="text-xs text-slate-400">You</p>
            </div>
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="You"
                className="w-10 h-10 rounded-full border border-white/20 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-playfair italic border border-white/20">
                {profile?.full_name?.charAt(0)}
              </div>
            )}
          </div>

          <button
            onClick={disconnectPartner}
            className="text-slate-500 hover:text-red-400 transition-colors p-2"
            title="Disconnect Partner">
            <Unlink size={18} />
          </button>
          <button
            onClick={signOut}
            className="text-slate-500 hover:text-white transition-colors p-2"
            title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-40 z-10 scroll-smooth">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="h-full flex flex-col items-center justify-center text-slate-500 italic font-playfair space-y-4 opacity-60">
            <Heart size={40} className="text-pink-500/50" />
            <p className="text-lg">It's just us here. Say hello...</p>
          </motion.div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
        <div ref={chatEndRef} />
      </main>

      {/* Input Area */}
      <div className="absolute bottom-0 w-full p-4 md:p-8 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/90 to-transparent z-20 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <ModeSelector
            show={showModes}
            activeMode={activeMode}
            onSelect={(mode) => {
              setActiveMode(mode);
              setShowModes(false);
            }}
          />

          <div className="flex items-center gap-3 p-2 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 focus-within:bg-white/10 focus-within:border-white/20 focus-within:shadow-[0_8px_32px_rgba(236,72,153,0.1)]">
            <button
              onClick={() => setShowModes(!showModes)}
              className={`p-3 rounded-2xl transition-all duration-300 ${activeMode.bg} text-[#0a0a0c] hover:scale-105 active:scale-95 shadow-lg`}>
              <activeMode.icon size={20} strokeWidth={2.5} />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={`Type a ${activeMode.name.toLowerCase()}...`}
              className="flex-1 bg-transparent border-none outline-none text-sm md:text-base placeholder:text-slate-500 text-slate-200 px-2"
            />

            <button
              onClick={sendMessage}
              className="p-3 mr-1 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300 active:scale-95">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
