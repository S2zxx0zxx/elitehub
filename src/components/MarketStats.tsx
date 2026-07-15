import React from "react";

const stats = [
  {
    number: "150M+",
    label: "Indian Creators",
    desc: "India's creator economy growing at 25% CAGR annually",
  },
  {
    number: "₹280B+",
    label: "Creator Economy",
    desc: "Direct-to-fan monetization market valued by 2027",
  },
  {
    number: "73%",
    label: "Want Direct Payouts",
    desc: "Creators who prefer platforms with no middlemen cuts",
  },
];

export function MarketStats() {
  return (
    <div className="space-y-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-surface border border-border rounded-3xl p-6 text-center shadow-glossy">
          <p className="font-serif font-bold text-4xl text-text-hi mb-2">{s.number}</p>
          <h3 className="font-bold text-text-hi mb-1">{s.label}</h3>
          <p className="text-text-lo text-sm leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}
