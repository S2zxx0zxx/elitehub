"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import { Chip } from "@/components/Chip";

type Role = "Fan" | "Creator" | null;
const CATEGORIES = ["Video Editing", "VFX", "Music", "Design", "Education", "Art", "Fitness"];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [handle, setHandle] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);

  // If we had publicMetadata synced, we'd check user.publicMetadata.role
  if (isLoaded && !user) {
    router.push("/");
    return null;
  }

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          categories: selectedCategories,
          handle: role === "Creator" ? handle : undefined,
          subscriptionPrice: role === "Creator" ? parseFloat(price) : undefined,
          photo: role === "Creator" ? photo : undefined,
        }),
      });

      if (res.ok) {
        // Wait a bit or redirect
        await user?.reload();
        router.push("/");
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-md mx-auto flex flex-col justify-center pb-24">
      <Card>
        <CardContent className="space-y-6 py-8">
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center space-y-2">
                <h1 className="font-display text-2xl font-bold">Choose your path</h1>
                <p className="text-text-lo">How do you want to use EliteHub?</p>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setRole("Fan")}
                  className={`w-full p-4 rounded-2xl border text-left transition-colors ${role === "Fan" ? "border-brand-yellow bg-brand-yellow/10" : "border-white/10 bg-surface-dark"}`}
                >
                  <h3 className="font-bold text-lg text-elite-white">Fan 🤩</h3>
                  <p className="text-text-lo text-sm">Discover and support your favorite creators.</p>
                </button>
                <button 
                  onClick={() => setRole("Creator")}
                  className={`w-full p-4 rounded-2xl border text-left transition-colors ${role === "Creator" ? "border-brand-yellow bg-brand-yellow/10" : "border-white/10 bg-surface-dark"}`}
                >
                  <h3 className="font-bold text-lg text-elite-white">Creator 🎨</h3>
                  <p className="text-text-lo text-sm">Earn directly from your fans and share premium content.</p>
                </button>
              </div>

              <Button 
                className="w-full" 
                disabled={!role} 
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && role === "Fan" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center space-y-2">
                <h1 className="font-display text-2xl font-bold">What interests you?</h1>
                <p className="text-text-lo">Pick a few categories to personalize your feed.</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {CATEGORIES.map(cat => (
                  <Chip 
                    key={cat} 
                    active={selectedCategories.includes(cat)}
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat}
                  </Chip>
                ))}
              </div>
              <Button 
                className="w-full" 
                disabled={selectedCategories.length === 0 || loading} 
                onClick={handleComplete}
              >
                {loading ? "Saving..." : "Start Exploring"}
              </Button>
            </div>
          )}

          {step === 2 && role === "Creator" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center space-y-2">
                <h1 className="font-display text-2xl font-bold">Set up your profile</h1>
                <p className="text-text-lo">Choose a unique handle for your page.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-text-lo mb-1 block">Username Handle</label>
                  <input 
                    type="text" 
                    className="w-full bg-surface-dark border border-white/10 rounded-xl p-3 text-elite-white focus:outline-none focus:border-brand-yellow"
                    placeholder="e.g. raj_editzz"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-text-lo mb-1 block">Profile Photo URL (or mediaKey)</label>
                  <input 
                    type="text" 
                    className="w-full bg-surface-dark border border-white/10 rounded-xl p-3 text-elite-white focus:outline-none focus:border-brand-yellow"
                    placeholder="e.g. key from R2"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-bold text-text-lo mb-1 block">Primary Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <Chip 
                        key={cat} 
                        active={selectedCategories.includes(cat)}
                        onClick={() => setSelectedCategories([cat])}
                      >
                        {cat}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                className="w-full" 
                disabled={!handle || selectedCategories.length === 0} 
                onClick={() => setStep(3)}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 3 && role === "Creator" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center space-y-2">
                <h1 className="font-display text-2xl font-bold">Subscription Price</h1>
                <p className="text-text-lo">How much will fans pay per month to unlock your private content?</p>
              </div>
              
              <div>
                <label className="text-sm font-bold text-text-lo mb-1 block">Monthly Price (₹)</label>
                <input 
                  type="number" 
                  className="w-full bg-surface-dark border border-white/10 rounded-xl p-3 text-elite-white focus:outline-none focus:border-brand-yellow text-2xl font-bold text-center"
                  placeholder="199"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <Button 
                className="w-full" 
                disabled={!price || loading} 
                onClick={handleComplete}
              >
                {loading ? "Creating..." : "Create Profile"}
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
    </main>
  );
}
