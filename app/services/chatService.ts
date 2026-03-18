/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "../config/supabase";
import { ModeId } from "../config/modes";

// NOTE: This service is currently deprecated in favor of the `useChat` hook.
// It has been updated to reflect the new database schema and fix TypeScript errors.

export const fetchMessages = async (coupleId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("couple_id", coupleId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
  return data || [];
};

// 2. Send a new message to the database
export const sendMessageToDB = async (
  coupleId: string,
  senderId: string,
  text: string,
  originalText: string | null,
  mode: ModeId,
) => {
  const { error } = await supabase
    .from("messages")
    .insert([
      { couple_id: coupleId, sender_id: senderId, text, originalText, mode },
    ]);

  if (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// 3. Listen for new messages in real-time
export const subscribeToMessages = (
  coupleId: string,
  onNewMessage: (msg: any) => void,
) => {
  const subscription = supabase
    .channel("public:messages")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `couple_id=eq.${coupleId}`,
      },
      (payload) => {
        onNewMessage(payload.new);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};
