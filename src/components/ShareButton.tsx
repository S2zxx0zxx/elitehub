"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./Button";

interface ShareButtonProps {
  readonly url: string;
  readonly title?: string;
  readonly text?: string;
  readonly variant?: "icon" | "button";
}

export function ShareButton({ url, title = "EliteHub", text = "Check this out on EliteHub", variant = "icon" }: ShareButtonProps) {
  const handleShare = async () => {
    // Make sure we have a fully qualified URL
    let path = url;
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    const fullUrl = url.startsWith("http") ? url : window.location.origin + path;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: fullUrl,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        // User cancelled or share failed, fallback to copy if not AbortError
        if (err instanceof Error && err.name !== "AbortError") {
          fallbackCopy(fullUrl);
        }
      }
    } else {
      fallbackCopy(fullUrl);
    }
  };

  const fallbackCopy = (fullUrl: string) => {
    navigator.clipboard.writeText(fullUrl)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link."));
  };

  if (variant === "button") {
    return (
      <Button variant="secondary" className="flex items-center gap-2" onClick={handleShare}>
        <Share2 size={18} /> Share
      </Button>
    );
  }

  return (
    <button 
      onClick={handleShare}
      className="text-text-lo hover:text-white transition-colors"
      aria-label="Share"
    >
      <Share2 size={24} />
    </button>
  );
}
