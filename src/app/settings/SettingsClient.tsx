"use client";

import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/Button";

export default function SettingsClient({ user }: { user: any }) {
  const { signOut } = useClerk();
  
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [upiId, setUpiId] = useState(user.upiId || "");
  const [theme, setTheme] = useState(user.theme || "dark");
  const [loading, setLoading] = useState(false);
  const [kycLoading, setKycLoading] = useState(false);
  const [kycId, setKycId] = useState("");
  const [kycName, setKycName] = useState("");
  const [kycStatus, setKycStatus] = useState(user.kycStatus || "none");

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, upiId, theme })
      });
      if (res.ok) alert("Settings saved successfully!");
      else alert("Error saving settings");
    } catch (e) {
      alert("Error saving settings");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-bg-dark pb-24">
      <TopBar />
      <div className="max-w-md mx-auto p-4 sm:p-8 space-y-6 mt-4">
        <h1 className="font-display text-3xl font-bold text-elite-white">Settings</h1>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-text-lo mb-1 block">Display Name</label>
            <input 
              type="text" 
              className="w-full bg-surface-dark border border-white/10 rounded-xl p-3 text-elite-white focus:border-brand-yellow focus:outline-none"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-text-lo mb-1 block">Bio</label>
            <textarea 
              className="w-full bg-surface-dark border border-white/10 rounded-xl p-3 text-elite-white focus:border-brand-yellow focus:outline-none h-24"
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-text-lo mb-1 block">UPI ID (For Payouts)</label>
            <input 
              type="text" 
              className="w-full bg-surface-dark border border-white/10 rounded-xl p-3 text-elite-white focus:border-brand-yellow focus:outline-none"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-text-lo mb-1 block">Theme</label>
            <select 
              className="w-full bg-surface-dark border border-white/10 rounded-xl p-3 text-elite-white focus:border-brand-yellow focus:outline-none"
              value={theme}
              onChange={e => setTheme(e.target.value)}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
          
          <Button className="w-full mt-4" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* KYC Section */}
        <div className="bg-surface-dark p-6 rounded-2xl border border-white/5 space-y-4">
          <h2 className="font-display font-bold text-xl text-elite-white">Verification (KYC)</h2>
          {kycStatus === "verified" && (
            <p className="text-green-500 font-bold text-sm">✅ Your identity is verified.</p>
          )}
          {kycStatus === "pending" && (
            <p className="text-brand-yellow font-bold text-sm">⏳ Verification pending admin approval.</p>
          )}
          {(kycStatus === "none" || kycStatus === "rejected") && (
            <>
              <p className="text-text-lo text-sm">Submit your ID to get a Blue/Gold tick.</p>
              <div>
                <label className="text-xs font-bold text-text-lo mb-1 block">Legal Name</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-elite-white focus:border-brand-yellow focus:outline-none"
                  value={kycName}
                  onChange={e => setKycName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-text-lo mb-1 block">ID Number (Aadhaar/PAN)</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-elite-white focus:border-brand-yellow focus:outline-none"
                  value={kycId}
                  onChange={e => setKycId(e.target.value)}
                />
              </div>
              <Button 
                className="w-full mt-2" 
                onClick={async () => {
                  setKycLoading(true);
                  const res = await fetch("/api/kyc", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idNumber: kycId, legalName: kycName })
                  });
                  if (res.ok) setKycStatus("pending");
                  setKycLoading(false);
                }} 
                disabled={kycLoading || !kycId || !kycName}
              >
                {kycLoading ? "Submitting..." : "Submit KYC"}
              </Button>
            </>
          )}
        </div>

        <div className="pt-4">
          <Button variant="secondary" className="w-full !text-red-500 !border-red-500/20" onClick={() => signOut()}>
            Log Out
          </Button>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
