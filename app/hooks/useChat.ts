// app/hooks/useChat.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
// Adjust this import path depending on where you initialize your Supabase client
import { supabase } from "../config/supabase";
import { MODES, ChatMode } from "../config/modes";
import { MessageProps } from "../components/MessageBubble";

export function useChat() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [partnerProfile, setPartnerProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [inputText, setInputText] = useState("");
  const [activeMode, setActiveMode] = useState<ChatMode>(MODES.just_us);

  // 1. Fetch user and profile on mount
  useEffect(() => {
    const initSession = async () => {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser ?? null);

      if (currentUser) {
        await fetchOrCreateProfile(currentUser);
      }
      setIsLoading(false);
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) fetchOrCreateProfile(session.user);
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  // 2. Fetch or create the user's profile
  async function fetchOrCreateProfile(currentUser: any) {
    const metadata = currentUser.user_metadata || {};
    const fullName =
      metadata.full_name || currentUser.email?.split("@")[0] || "User";
    const avatarUrl = metadata.avatar_url || metadata.picture || null;

    let { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    if (!data) {
      // Generate a random 6-character code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data: newProfile } = await supabase
        .from("profiles")
        .insert({
          id: currentUser.id,
          email: currentUser.email,
          pairing_code: code,
          full_name: fullName,
          avatar_url: avatarUrl,
        })
        .select()
        .single();
      data = newProfile;
    } else if (!data.full_name || !data.avatar_url) {
      // Backward compatibility: Update existing profiles with Google data
      const { data: updatedProfile } = await supabase
        .from("profiles")
        .update({ full_name: fullName, avatar_url: avatarUrl })
        .eq("id", currentUser.id)
        .select()
        .single();
      if (updatedProfile) data = updatedProfile;
    }

    setProfile(data);
  };

  // 2.5 Listen for profile updates (e.g., when a partner links with us)
  useEffect(() => {
    if (!user?.id) return;

    const profileChannel = supabase
      .channel(`profile-updates-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          setProfile(payload.new);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
    };
  }, [user?.id]);

  // 3. Load messages & subscribe to realtime when profile/couple_id changes
  useEffect(() => {
    if (!profile?.couple_id) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("couple_id", profile.couple_id)
        .order("created_at", { ascending: true });

      if (data) {
        setMessages(data.map(formatMessage));
      }
    };

    loadMessages();

    // Fetch partner profile information
    const loadPartnerProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("couple_id", profile.couple_id)
        .neq("id", profile.id)
        .single();
      if (data) setPartnerProfile(data);
    };
    loadPartnerProfile();

    // Subscribe to realtime updates for this specific couple's room
    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `couple_id=eq.${profile.couple_id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, formatMessage(payload.new)]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.couple_id]);

  // Transform raw DB schema back into UI schema so MessageBubble doesn't have to change
  function formatMessage(msg: any): MessageProps {
    return {
    id: msg.id,
    text: msg.text,
    originalText: msg.originalText,
    mode: msg.mode,
      sender: msg.sender_id === profile?.id ? "me" : "partner",
    };
  }

  // 4. Send Message (Now with correct Schema IDs)
  const sendMessage = async () => {
    if (!inputText.trim() || !profile?.couple_id) return;

    const msgText = inputText;
    setInputText(""); // optimistic clear

    const { error } = await supabase.from("messages").insert({
      couple_id: profile.couple_id,
      sender_id: profile.id,
      text: msgText, // Note: apply transformations here if needed
      mode: activeMode.id,
      originalText: activeMode.id !== "just_us" ? msgText : null,
    });

    if (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    }
  };

  // 5. Connect two users together
  const pairWithPartner = async (partnerCode: string) => {
    // A. Find partner profile
    const { data: partnerProfile, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("pairing_code", partnerCode)
      .single();

    if (profileErr || !partnerProfile) {
      console.error("Error finding partner:", profileErr);
      throw new Error("Partner not found");
    }

    // B. Create a new couple room
    const { data: newCouple, error: coupleErr } = await supabase
      .from("couples")
      .insert({ created_at: new Date().toISOString() })
      .select()
      .single();

    if (coupleErr) {
      console.error("Error creating couple room:", coupleErr);
      throw new Error("Could not create couple room");
    }

    // C. Update both profiles
    const { error: updateErr } = await supabase
      .from("profiles")
      .update({ couple_id: newCouple.id })
      .in("id", [profile.id, partnerProfile.id]);

    if (updateErr) {
      console.error("Error linking profiles:", updateErr);
      throw new Error("Could not link profiles");
    }

    // Force UI to show chat
    setProfile({ ...profile, couple_id: newCouple.id });
  };

  // 6. Un-pair users
  const disconnectPartner = async () => {
    await supabase
      .from("profiles")
      .update({ couple_id: null })
      .eq("id", profile.id);
    setProfile({ ...profile, couple_id: null });
    setPartnerProfile(null);
    setMessages([]);
  };

  return {
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
    isPaired: !!profile?.couple_id,
    myPairingCode: profile?.pairing_code || "------",
    pairWithPartner,
    disconnectPartner,
  };
}
