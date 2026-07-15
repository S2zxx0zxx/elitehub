import React from "react";

const features = [
  { icon: "💰", title: "Instant Payouts", desc: "UPI payouts straight to your bank, no delays", bg: "bg-emerald-50" },
  { icon: "✅", title: "Verified Creators", desc: "Blue & gold tick system for trust", bg: "bg-blue-50" },
  { icon: "💬", title: "Direct Fan Chat", desc: "Message fans directly, build real connections", bg: "bg-amber-50" },
  { icon: "🔒", title: "Content Locking", desc: "Free posts to grow, locked posts to earn", bg: "bg-rose-50" },
  { icon: "📊", title: "Real Analytics", desc: "Track views, likes, saves & earnings live", bg: "bg-purple-50" },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8">
      {features.map((f) => (
        <div key={f.title} className="flex flex-col items-center text-center gap-2">
          <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center text-2xl shadow-glossy`}>
            {f.icon}
          </div>
          <h3 className="font-bold text-text-hi text-sm">{f.title}</h3>
          <p className="text-text-lo text-xs leading-relaxed px-1">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
