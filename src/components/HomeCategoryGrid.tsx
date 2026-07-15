import React from "react";
import Image from "next/image";

// Informational-only visual grid (not clickable) using the real 3D icons.
const categories = [
  { label: "Gaming", icon: "/assets/category_icons/gaming.png" },
  { label: "Music", icon: "/assets/category_icons/music.png" },
  { label: "Photography", icon: "/assets/category_icons/photography.png" },
  { label: "Fitness", icon: "/assets/category_icons/fitness.png" },
  { label: "Trading", icon: "/assets/category_icons/trading.png" },
  { label: "Travel", icon: "/assets/category_icons/travel.png" },
  { label: "Art", icon: "/assets/category_icons/artist.png" },
  { label: "Coding", icon: "/assets/category_icons/programming.png" },
  { label: "Fashion", icon: "/assets/category_icons/fashion.png" },
  { label: "Education", icon: "/assets/category_icons/education.png" },
  { label: "Blogger", icon: "/assets/category_icons/blogger.png" },
  { label: "Influencer", icon: "/assets/category_icons/influencer.png" },
];

export function HomeCategoryGrid() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {categories.map((cat) => (
        <div
          key={cat.label}
          className="bg-surface border border-white/5 rounded-3xl p-3 flex flex-col items-center justify-center text-center gap-2 hover:border-brand-yellow/30 transition-colors"
        >
          <div className="relative w-12 h-12">
            <Image src={cat.icon} alt={cat.label} fill sizes="48px" className="object-contain drop-shadow-lg" />
          </div>
          <span className="text-text-hi text-xs font-bold">{cat.label}</span>
        </div>
      ))}
    </div>
  );
}
