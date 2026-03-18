import { supabase } from "../config/supabase";

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin, // Sends them back to your app after logging in
    },
  });
  if (error) throw error;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// We will use this to check if someone is logged in when the app loads
export const getCurrentUser = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user || null;
};
