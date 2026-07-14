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
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="font-display font-bold text-xl">Har tarah ke creators</h3>
        <p className="text-sm text-text-lo">Find your niche and start growing</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <div 
            key={cat.label} 
            className="bg-surface border border-white/5 rounded-[24px] p-4 flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden group shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-full bg-brand-yellow/10 flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
              <cat.icon className="text-brand-yellow w-6 h-6" />
            </div>
            <span className="text-text-hi text-[11px] uppercase tracking-wider font-bold z-10 line-clamp-1">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
