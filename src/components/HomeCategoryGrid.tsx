import React from "react";
import { 
  Gamepad2, Music, Camera, Dumbbell, TrendingUp, Plane, 
  Sparkles, Video, Shirt, Palette, PenTool, BookOpen 
} from "lucide-react";

const categories = [
  { label: "Gamers", icon: Gamepad2 },
  { label: "Musicians", icon: Music },
  { label: "Photographers", icon: Camera },
  { label: "Trainers", icon: Dumbbell },
  { label: "Traders", icon: TrendingUp },
  { label: "Travellers", icon: Plane },
  { label: "Influencers", icon: Sparkles },
  { label: "Content Creators", icon: Video },
  { label: "Fashion", icon: Shirt },
  { label: "Artists", icon: Palette },
  { label: "Bloggers", icon: PenTool },
  { label: "Educators", icon: BookOpen },
];

export function HomeCategoryGrid() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {categories.map((cat, i) => (
        <div 
          key={i} 
          className="bg-surface border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-brand-yellow/30 transition-colors"
        >
          <cat.icon className="text-brand-yellow w-6 h-6" />
          <span className="text-text-hi text-xs font-bold">{cat.label}</span>
        </div>
      ))}
    </div>
  );
}
