import React from "react";
import Link from "next/link";

interface TrendingCreator {
  id: string;
  name?: string | null;
  handle?: string | null;
  photo?: string | null;
  tags?: string[] | null;
  tickTier?: string | null;
}

interface TrendingCreatorGridProps {
  creators: TrendingCreator[];
}

// Real-data version of the same tall-card grid shell used in
// TrendingCategoryGrid — photo as bg, name + tag overlay, verified tick.
export function TrendingCreatorGrid({ creators }: TrendingCreatorGridProps) {
  const shown = creators.slice(0, 6);

  if (shown.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {shown.map((creator, i) => {
        const initials = (creator.name || creator.handle || "C")[0].toUpperCase();
        const isVerified = creator.tickTier === "gold" || creator.tickTier === "blue";
        return (
          <Link key={creator.id} href={`/${creator.handle}`}>
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-glossy bg-surface border border-border group cursor-pointer">
              {creator.photo ? (
                <img src={creator.photo} alt={creator.name || ""} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/30 to-navy/20 flex items-center justify-center">
                  <span className="text-4xl font-bold text-text-hi/40">{initials}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent group-hover:from-black/80 transition-colors" />
              {i < 2 && (
                <div className="absolute top-3 left-3 bg-coral text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  🔥 Trending
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="font-serif font-bold text-white text-base leading-tight flex items-center gap-1">
                  {creator.name || creator.handle}
                  {isVerified && <span className="text-brand-yellow text-sm">✓</span>}
                </h3>
                <p className="text-white/80 text-xs mt-0.5 line-clamp-1">
                  {creator.tags && creator.tags.length > 0 ? creator.tags.join(", ") : "Creator"}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
