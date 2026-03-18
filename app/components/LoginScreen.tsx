"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signInWithGoogle } from "../services/authService";
import { supabase } from "../config/supabase";

export function LoginScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF9] text-stone-800 p-4 relative overflow-hidden">
      {/* Ambient Warm Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-200/40 blur-[120px] rounded-full mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-200/40 blur-[120px] rounded-full mix-blend-multiply pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-10 max-w-sm w-full z-10">
        <div className="space-y-4">
          <h1 className="text-6xl font-playfair italic tracking-wider bg-clip-text text-transparent bg-gradient-to-br from-rose-600 via-orange-500 to-red-500 drop-shadow-sm">
            Only Us
          </h1>
          <p className="text-stone-500 font-inter text-sm tracking-[0.2em] uppercase">
            Your private space
          </p>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full py-4 px-6 rounded-2xl bg-white/60 hover:bg-white border border-stone-200 backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-3 font-inter font-medium text-stone-700 shadow-sm hover:shadow-md hover:-translate-y-1">
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

        {/* Local Development Shortcut */}
        {process.env.NODE_ENV === "development" && (
          <div className="pt-8 mt-8 border-t border-stone-200/50">
            <p className="text-xs text-stone-400 font-inter uppercase tracking-widest mb-4">
              Local Dev Testing
            </p>
            <form 
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = (formData.get("email") as string).trim();
                const password = formData.get("password") as string;
                const action = (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value");

                if (action === "signup") {
                  const { error } = await supabase.auth.signUp({ email, password });
                  if (error) alert("Sign up failed: " + error.message);
                  else alert("Sign up successful! You can now log in.");
                } else {
                  const { error } = await supabase.auth.signInWithPassword({ email, password });
                  if (error) alert("Login failed: " + error.message);
                }
              }}
            >
              <input 
                name="email" 
                type="email" 
                placeholder="you+dev@gmail.com" 
                required
                className="w-full bg-white/80 border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-200 transition-all font-inter"
                defaultValue="dev@onlyus.local"
              />
              <input 
                name="password" 
                type="password" 
                placeholder="Password (min 6 chars)" 
                required
                className="w-full bg-white/80 border border-stone-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-200 transition-all font-inter"
                defaultValue="password123"
              />
              <div className="flex gap-2">
                <button 
                  type="submit" 
                  value="login"
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 rounded-xl text-sm font-medium transition-colors"
                >
                  Log In
                </button>
                <button 
                  type="submit" 
                  value="signup"
                  className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
