"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import { BottomNav } from "@/components/BottomNav";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { getCroppedImg } from "@/lib/cropImage";
import { Point, Area } from "react-easy-crop";
import { toast } from "sonner";

export default function CreatePage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [postType, setPostType] = useState<"feed" | "product">("feed");
  
  // Crop states
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  // Form states
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [price, setPrice] = useState("");
  
  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoaded && !isSignedIn) return null; // Or redirect

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      if (postType === "product") {
        setPreview(null);
        setCroppedBlob(selectedFile);
        return;
      }
      
      setPreview(URL.createObjectURL(selectedFile));
      
      // If it's an image, start crop mode
      if (selectedFile.type.startsWith("image/")) {
        setIsCropping(true);
      } else {
        // Video doesn't use cropping currently
        setCroppedBlob(selectedFile);
      }
    }
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!preview || !croppedAreaPixels) return;
    try {
      const blob = await getCroppedImg(preview, croppedAreaPixels);
      setCroppedBlob(blob);
      setIsCropping(false);
      if (blob) {
        setPreview(URL.createObjectURL(blob));
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image.");
    }
  };

  const uploadToR2 = (signedUrl: string, fileData: Blob, contentType: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Upload network error")));
      xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

      xhr.open("PUT", signedUrl, true);
      xhr.setRequestHeader("Content-Type", contentType);
      xhr.send(fileData);
    });
  };

  const handlePublish = async () => {
    if (!file || !croppedBlob) return;
    setUploading(true);
    setUploadProgress(0);

    try {
      const contentType = file.type;
      
      // 1. Get Presigned URL
      const urlRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: contentType,
          type: postType,
        }),
      });
      const { signedUrl, key } = await urlRes.json();

      if (!signedUrl) throw new Error("Failed to get signed URL");

      // 2. Upload file direct to R2 with XMLHttpRequest for progress
      await uploadToR2(signedUrl, croppedBlob, contentType);

      // 3. Save post to database
      const postRes = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: postType === "product" ? "product" : (file.type.startsWith("video/") ? "video" : "photo"),
          mediaKey: key,
          caption,
          visibility: postType === "product" ? "private" : visibility,
          price: (postType === "product" || visibility === "private") ? price : null,
          tags: tags,
        }),
      });

      if (postRes.ok) {
        router.refresh();
        router.push(`/dashboard`);
      } else {
        toast.error("Failed to save post");
        setUploading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-md mx-auto pb-24">
      <h1 className="font-display text-2xl font-bold mb-6">Create Content</h1>
      
      <div className="flex border-b border-white/10 mb-6">
        <button 
          onClick={() => { setPostType("feed"); setFile(null); setPreview(null); setCroppedBlob(null); }}
          className={`flex-1 py-3 text-center transition-colors ${postType === "feed" ? "border-b-2 border-brand-yellow font-bold text-brand-yellow" : "text-text-lo hover:text-white"}`}
        >
          Post / Reel
        </button>
        <button 
          onClick={() => { setPostType("product"); setFile(null); setPreview(null); setCroppedBlob(null); }}
          className={`flex-1 py-3 text-center transition-colors ${postType === "product" ? "border-b-2 border-brand-yellow font-bold text-brand-yellow" : "text-text-lo hover:text-white"}`}
        >
          Digital Product
        </button>
      </div>
      
      <Card>
        <CardContent className="space-y-6">
          {!file ? (
            <div 
              className="w-full h-48 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-text-lo hover:border-brand-yellow cursor-pointer transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-3xl mb-2">+</span>
              <p>{postType === "product" ? "Select PDF or ZIP" : "Tap to select media"}</p>
            </div>
          ) : isCropping && preview ? (
            <div className="space-y-4">
              <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-[4/5] h-[400px]">
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 5}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className="flex justify-between items-center gap-4">
                <Button variant="secondary" className="flex-1" onClick={() => { setFile(null); setPreview(null); setIsCropping(false); }}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleCropSave}>
                  Save Crop
                </Button>
              </div>
            </div>
          ) : preview ? (
            <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-[4/5]">
              {file?.type.startsWith("video/") ? (
                <video src={preview} className="w-full h-full object-cover" controls />
              ) : (
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
              )}
              <button 
                onClick={() => { setFile(null); setPreview(null); setCroppedBlob(null); }}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="w-full h-32 bg-surface-dark border border-white/10 rounded-2xl flex flex-col items-center justify-center relative">
              <span className="font-bold text-brand-yellow">{file.name}</span>
              <p className="text-xs text-text-lo mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <button 
                onClick={() => { setFile(null); setCroppedBlob(null); }}
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
            accept={postType === "product" ? ".pdf,.zip,application/pdf,application/zip,application/x-zip-compressed" : "image/*,video/*"}
            onChange={handleFileChange}
          />

          {!isCropping && file && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <label className="text-sm font-bold text-text-lo mb-1 block">
                  {postType === "product" ? "Product Name / Title" : "Caption"}
                </label>
                <textarea 
                  className="w-full bg-surface-dark border border-white/10 rounded-xl p-3 text-elite-white focus:outline-none focus:border-brand-yellow resize-none h-24"
                  placeholder={postType === "product" ? "e.g. 100+ Reels Bundle" : "What's this about?"}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-text-lo mb-1 block">Tags (Max 5)</label>
                <input 
                  type="text" 
                  className="w-full bg-surface-dark border border-white/10 rounded-xl p-3 text-elite-white focus:outline-none focus:border-brand-yellow mb-2"
                  placeholder="Type a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const newTag = tagInput.trim().toLowerCase();
                      if (newTag && !tags.includes(newTag) && tags.length < 5) {
                        setTags([...tags, newTag]);
                      }
                      setTagInput("");
                    }
                  }}
                  disabled={tags.length >= 5}
                />
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <div 
                      key={tag} 
                      className="bg-brand-yellow/20 text-brand-yellow px-3 py-1 rounded-full text-sm font-bold cursor-pointer"
                      onClick={() => setTags(tags.filter(t => t !== tag))}
                    >
                      {tag} ✕
                    </div>
                  ))}
                </div>
              </div>

              {postType !== "product" && (
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
              )}

              {(visibility === "private" || postType === "product") && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="text-sm font-bold text-brand-yellow mb-1 block">
                    {postType === "product" ? "Price (₹) *" : "Unlock Price (₹)"}
                  </label>
                  <input 
                    type="number" 
                    className="w-full bg-surface-dark border border-white/10 rounded-xl p-3 text-brand-yellow focus:outline-none focus:border-brand-yellow font-bold text-lg"
                    placeholder="e.g. 199"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required={postType === "product"}
                  />
                  {postType !== "product" && <p className="text-xs text-text-lo mt-1">Leave blank to use your default subscription access.</p>}
                </div>
              )}

              {uploading && (
                <div className="w-full bg-surface-dark rounded-full h-4 overflow-hidden border border-white/10 relative">
                  <div 
                    className="bg-brand-yellow h-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-black mix-blend-difference">
                    {uploadProgress}%
                  </span>
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
