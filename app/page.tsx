"use client";

import { useState, useRef, useEffect } from "react";
import { Send, LogOut, Heart, Unlink } from "lucide-react";
import { motion } from "framer-motion";
import { useChat } from "./hooks/useChat";
import MessageBubble from "./components/MessageBubble";
import ModeSelector from "./components/ModeSelector";
import { LoadingScreen } from "./components/LoadingScreen";
import { LoginScreen } from "./components/LoginScreen";
import { LobbyScreen } from "./components/LobbyScreen";
import { signOut } from "./services/authService";

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

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // View States
  if (isLoading) return <LoadingScreen />;
  if (!user) return <LoginScreen />;
  if (!isPaired) {
    return (
      <LobbyScreen
        user={user}
        profile={profile}
        myPairingCode={myPairingCode}
        pairWithPartner={pairWithPartner}
      />
    );
  }

  // Main Chat Interface
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
            <p className="text-lg">It&apos;s just us here. Say hello...</p>
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
