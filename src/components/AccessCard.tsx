import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Box, BadgeCheck } from "lucide-react";

interface AccessCardProps {
  user: {
    id: string;
    name?: string | null;
    handle?: string | null;
    role?: string | null;
    tickTier?: string | null; // "none", "blue", "gold"
  };
  domain?: string;
}

export function AccessCard({ user, domain = "elitehub.com" }: AccessCardProps) {
  const shortId = user.id ? user.id.substring(0, 8) : user.handle || "MEMBER";
  const profileUrl = `https://${domain}/${user.handle || ""}`;
  const isGold = user.tickTier === "gold";
  const isBlue = user.tickTier === "blue";

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[1.6/1] bg-[#1c1c1e] rounded-[24px] p-6 text-white shadow-2xl overflow-hidden group transition-transform duration-300 hover:scale-[1.02] hover:rotate-1 animate-in fade-in zoom-in-95">
      {/* Glossy Sheen Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/40 pointer-events-none" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none transform -translate-x-full group-hover:translate-x-full" />

      {/* Top Section */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-2">
          <Box className="text-white w-6 h-6" />
          <span className="font-display font-bold text-lg tracking-tight">EliteHub</span>
        </div>
        <div className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
          ACCESS CARD
        </div>
      </div>

      {/* Middle Section: Member Name & ID */}
      <div className="absolute top-1/2 left-6 -translate-y-1/2 relative z-10 mt-6">
        <h2 className="font-mono text-2xl font-bold uppercase tracking-wider mb-1 line-clamp-1">
          {user.name || user.handle || "MEMBER"}
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-xs text-white/50 font-mono tracking-widest">
            ID: {shortId.toUpperCase()}
          </p>
          {isGold && <BadgeCheck className="w-4 h-4 text-brand-yellow" />}
          {isBlue && <BadgeCheck className="w-4 h-4 text-blue-500" />}
        </div>
      </div>

      {/* Bottom Section: Role & QR */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end relative z-10">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">
            MEMBER TYPE
          </p>
          <p className="font-bold tracking-widest uppercase text-white/80">
            {user.role || "FAN"}
          </p>
        </div>
        
        <div className="bg-white p-1.5 rounded-xl shadow-inner">
          <QRCodeSVG 
            value={profileUrl} 
            size={48} 
            bgColor={"#ffffff"} 
            fgColor={"#000000"} 
            level={"L"} 
          />
        </div>
      </div>
    </div>
  );
}
