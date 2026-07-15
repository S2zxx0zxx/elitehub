import React from "react";

// Visual-only trending categories grid (placeholder gradients — swap in
// real images later). Mirrors Travel Together's destination-card layout:
// tall rounded card, gradient bg, dark overlay, badge top-left, title
// bottom-left.
const trendingCategories = [
  { label: "Gaming", tag: "Live streams & clips", trending: true, gradient: "from-purple-600 to-indigo-700" },
  { label: "Fitness", tag: "Workout plans", trending: true, gradient: "from-orange-500 to-red-600" },
  { label: "Music", tag: "Beats & covers", trending: false, gradient: "from-pink-500 to-rose-600" },
  { label: "Photography", tag: "Presets & tips", trending: true, gradient: "from-sky-500 to-blue-700" },
  { label: "Trading", tag: "Market calls", trending: false, gradient: "from-emerald-500 to-teal-700" },
  { label: "Art", tag: "Digital & sketches", trending: false, gradient: "from-fuchsia-500 to-purple-700" },
];

export function TrendingCategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {trendingCategories.map((cat) => (
        <div
          key={cat.label}
          className={`relative aspect-[3/4] rounded-3xl overflow-hidden shadow-glossy bg-gradient-to-br ${cat.gradient} cursor-pointer group`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:from-black/80 transition-colors" />
          {cat.trending && (
            <div className="absolute top-3 left-3 bg-coral text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              🔥 Trending
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-serif font-bold text-white text-lg leading-tight">{cat.label}</h3>
            <p className="text-white/80 text-xs mt-0.5">{cat.tag}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
