"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import { BottomNav } from "@/components/BottomNav";

export default function CreatePage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [price, setPrice] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoaded && !isSignedIn) return null; // Or redirect

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handlePublish = async () => {
    if (!file) return;
    setUploading(true);

    try {
      // 1. Get Presigned URL
      const urlRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });
      const { signedUrl, key } = await urlRes.json();

      if (!signedUrl) throw new Error("Failed to get signed URL");

      // 2. Upload file direct to R2
      await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      // 3. Save post to database
      const postRes = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: file.type.startsWith("video/") ? "video" : "photo",
          mediaKey: key,
          caption,
          visibility,
          price: visibility === "private" ? price : null,
          category: "General",
        }),
      });

      if (postRes.ok) {
        router.push(`/dashboard`);
      } else {
        alert("Failed to save post");
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
    setUploading(false);
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-md mx-auto pb-24">
      <h1 className="font-display text-2xl font-bold mb-6">Create Post</h1>
      
      <Card>
        <CardContent className="space-y-6">
          {!preview ? (
            <div 
              className="w-full h-48 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-text-lo hover:border-brand-yellow cursor-pointer transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-3xl mb-2">+</span>
              <p>Tap to select media</p>
            </div>
          ) : (
            <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-[4/5]">
              {file?.type.startsWith("video/") ? (
                <video src={preview} className="w-full h-full object-cover" controls />
              ) : (
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
              )}
              <button 
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur"
              >
                ✕
              </button>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,video/*"
            onChange={handleFileChange}
          />

          {file && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <label className="text-sm font-bold text-text-lo mb-1 block">Caption</label>
                <textarea 
                  className="w-full bg-surface-dark border border-white/10 rounded-xl p-3 text-elite-white focus:outline-none focus:border-brand-yellow resize-none h-24"
                  placeholder="What's this about?"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-dark rounded-xl border border-white/10">
                <div>
                  <h4 className="font-bold">Visibility</h4>
                  <p className="text-xs text-text-lo">Lock this post for fans?</p>
                </div>
                <div className="flex bg-black/50 rounded-lg p-1">
                  <button 
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${visibility === "public" ? "bg-white text-black" : "text-text-lo"}`}
                    onClick={() => setVisibility("public")}
                  >
                    Public
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${visibility === "private" ? "bg-brand-yellow text-black" : "text-text-lo"}`}
                    onClick={() => setVisibility("private")}
                  >
                    Private 🔒
                  </button>
                </div>
              </div>

              {visibility === "private" && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="text-sm font-bold text-brand-yellow mb-1 block">Unlock Price (₹)</label>
                  <input 
                    type="number" 
                    className="w-full bg-surface-dark border border-white/10 rounded-xl p-3 text-brand-yellow focus:outline-none focus:border-brand-yellow font-bold text-lg"
                    placeholder="e.g. 199"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <p className="text-xs text-text-lo mt-1">Leave blank to use your default subscription access.</p>
                </div>
              )}

              <Button 
                className="w-full" 
                onClick={handlePublish}
                disabled={uploading}
              >
                {uploading ? "Publishing..." : "Publish Post"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <BottomNav />
    </main>
  );
}
