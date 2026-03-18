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
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#FAFAF9]">
      {/* Ambient Chat Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200/30 blur-[120px] rounded-full mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-200/30 blur-[120px] rounded-full mix-blend-multiply pointer-events-none" />

      {/* Header */}
      <header className="p-4 md:p-6 border-b border-stone-200 bg-white/60 backdrop-blur-xl z-20 flex justify-between items-center shadow-sm shrink-0">
        {/* Partner Info */}
        <div className="flex items-center gap-3">
          {partnerProfile ? (
            <>
              {partnerProfile.avatar_url ? (
                <img
                  src={partnerProfile.avatar_url}
                  alt="Partner"
                  className="w-10 h-10 rounded-full border border-rose-200 shadow-sm object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-playfair italic border border-rose-200 shadow-sm">
                  {partnerProfile.full_name?.charAt(0)}
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-stone-800">
                  {partnerProfile.full_name}
                </p>
                <p className="text-xs text-rose-500 font-medium">Partner</p>
              </div>
            </>
          ) : (
            <div className="w-10" />
          )}
        </div>

        <h1 className="text-center text-2xl font-playfair italic tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-400 absolute left-1/2 -translate-x-1/2 font-semibold">
          Only Us
        </h1>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="items-center gap-2 text-right hidden lg:flex mr-2">
            <div>
              <p className="text-sm font-medium text-stone-800">
                {profile?.full_name}
              </p>
              <p className="text-xs text-stone-500">You</p>
            </div>
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="You"
                className="w-10 h-10 rounded-full border border-stone-200 object-cover shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center font-playfair italic border border-stone-200 text-stone-600">
                {profile?.full_name?.charAt(0)}
              </div>
            )}
          </div>

          <button
            onClick={disconnectPartner}
            className="text-stone-400 hover:text-rose-500 transition-colors p-2"
            title="Disconnect Partner">
            <Unlink size={18} />
          </button>
          <button
            onClick={signOut}
            className="text-stone-400 hover:text-stone-800 transition-colors p-2"
            title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto min-h-0 p-4 md:p-8 space-y-6 pb-40 z-10 scroll-smooth">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="h-full flex flex-col items-center justify-center text-stone-400 italic font-playfair space-y-4 opacity-80">
            <Heart size={40} className="text-rose-200/60" fill="currentColor" />
            <p className="text-lg">It&apos;s just us here. Say hello...</p>
          </motion.div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
        <div ref={chatEndRef} />
      </main>

      {/* Input Area */}
      <div className="absolute bottom-0 w-full p-4 md:p-8 bg-gradient-to-t from-[#FAFAF9] via-[#FAFAF9]/90 to-transparent z-20 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <ModeSelector
            show={showModes}
            activeMode={activeMode}
            onSelect={(mode) => {
              setActiveMode(mode);
              setShowModes(false);
            }}
          />

          <div className="flex items-center gap-3 p-2 rounded-3xl bg-white border border-stone-200 shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-rose-200 focus-within:border-rose-300">
            <button
              onClick={() => setShowModes(!showModes)}
              className={`p-3 rounded-2xl transition-all duration-300 ${activeMode.bg} text-white hover:scale-105 active:scale-95 shadow-sm`}>
              <activeMode.icon size={20} strokeWidth={2.5} />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={`Type a ${activeMode.name.toLowerCase()}...`}
              className="flex-1 bg-transparent border-none outline-none text-sm md:text-base placeholder:text-stone-400 text-stone-800 px-2"
            />

            <button
              onClick={sendMessage}
              className="p-3 mr-1 rounded-2xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300 active:scale-95">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
