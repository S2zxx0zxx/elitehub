import React from "react";

const checklist = [
  "Instant like & comment notifications",
  "Secure UPI-native payouts",
  "Locked content, unlocked on purchase",
  "Offline access to purchased content",
];

const mockFeed = [
  { name: "Aisha R.", tag: "Fitness Coach 💪", pct: "94%" },
  { name: "Rohan K.", tag: "Music Producer 🎵", pct: "89%" },
  { name: "Dev S.", tag: "Photographer 📸", pct: "87%" },
];

export function AppDownload() {
  return (
    <div className="text-center">
      <h2 className="font-serif font-bold text-3xl text-text-hi mb-4 leading-tight">
        Download the EliteHub App
      </h2>
      <p className="text-text-lo mb-8 leading-relaxed">
        Your entire creator business in your pocket. Post, chat, get paid — all from one app.
      </p>

      <div className="space-y-3 mb-8 text-left max-w-xs mx-auto">
        {checklist.map((item) => (
          <div key={item} className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs shrink-0">✓</span>
            <span className="text-text-hi text-sm">{item}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3 mb-10">
        <button className="w-full bg-navy text-white rounded-2xl py-3 flex flex-col items-center shadow-glossy">
          <span className="text-[10px] text-white/60">Download on</span>
          <span className="font-bold text-lg">App Store</span>
        </button>
        <button className="w-full bg-navy text-white rounded-2xl py-3 flex flex-col items-center shadow-glossy">
          <span className="text-[10px] text-white/60">Get it on</span>
          <span className="font-bold text-lg">Google Play</span>
        </button>
      </div>

      <div className="relative w-[240px] h-[480px] mx-auto rounded-[36px] bg-navy p-3 shadow-glossy-lg">
        <div className="w-full h-full rounded-[26px] bg-gradient-to-b from-navy to-[#2d2d54] p-4 overflow-hidden flex flex-col">
          <div className="flex justify-between text-white text-[10px] mb-4">
            <span>9:41</span>
            <span>87%</span>
          </div>
          <h3 className="font-serif font-bold text-white text-lg text-center mb-4">EliteHub</h3>
          <div className="space-y-2 flex-1 overflow-hidden">
            {mockFeed.map((m) => (
              <div key={m.name} className="bg-white/95 rounded-2xl p-2.5 flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-brand-yellow/40 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-text-hi text-xs truncate">{m.name}</p>
                  <p className="text-text-lo text-[10px] truncate">{m.tag}</p>
                </div>
                <span className="text-emerald-600 font-bold text-xs shrink-0">{m.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
