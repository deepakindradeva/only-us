/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heart, Sparkles, Feather, EyeOff, Target, Camera } from "lucide-react";

export type ModeId =
  | "just_us"
  | "compliment"
  | "poetry"
  | "mystery"
  | "dare"
  | "memory";

export interface ChatMode {
  id: ModeId;
  name: string;
  icon: any; // Lucide icon reference
  color: string; // Tailwind text color
  bg: string; // Tailwind background color
}

export const MODES: Record<ModeId, ChatMode> = {
  just_us: {
    id: "just_us",
    name: "Just Us",
    icon: Heart,
    color: "text-rose-400",
    bg: "bg-rose-400",
  },
  compliment: {
    id: "compliment",
    name: "Compliment Bomb",
    icon: Sparkles,
    color: "text-orange-400",
    bg: "bg-orange-400",
  },
  poetry: {
    id: "poetry",
    name: "Poet Mode",
    icon: Feather,
    color: "text-amber-500",
    bg: "bg-amber-500",
  },
  mystery: {
    id: "mystery",
    name: "Mystery Mode",
    icon: EyeOff,
    color: "text-stone-500",
    bg: "bg-stone-500",
  },
  dare: {
    id: "dare",
    name: "Dare & Challenge",
    icon: Target,
    color: "text-red-400",
    bg: "bg-red-400",
  },
  memory: {
    id: "memory",
    name: "Memory Lane",
    icon: Camera,
    color: "text-yellow-500",
    bg: "bg-yellow-500",
  },
};
