"use client";

import { useState } from "react";
import { CheckoutSheet } from "./CheckoutSheet";
import { Button } from "./Button";

interface Post {
  id: string;
  type: string;
  visibility: string;
  price: number | null;
}

export function ProfileClient({ 
  posts, 
  creatorName, 
  handle,
  creatorId,
  subscriptionPrice,
  isSubscribed,
  initialIsFollowing
}: { 
  posts: Post[], 
  creatorName: string, 
  handle: string,
  creatorId: string,
  subscriptionPrice: number,
  isSubscribed: boolean,
  initialIsFollowing?: boolean
}) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState<"posts" | "shop">("posts");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing || false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const toggleFollow = async () => {
    setIsFollowLoading(true);
    const prev = isFollowing;
    setIsFollowing(!prev);
    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorId })
      });
      if (!res.ok) setIsFollowing(prev);
    } catch {
      setIsFollowing(prev);
    }
    setIsFollowLoading(false);
  };

  return (
    <>
      <div className="flex gap-3 mb-8">
        <Button 
          className="flex-1"
          onClick={() => setIsCheckoutOpen(true)}
          disabled={isSubscribed}
        >
          {isSubscribed ? "Subscribed" : `Subscribe ${subscriptionPrice ? `₹${subscriptionPrice}/mo` : 'Free'}`}
        </Button>
        <Button 
          variant="secondary" 
          className="px-6"
          onClick={toggleFollow}
          disabled={isFollowLoading}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        <button 
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-3 text-center transition-colors ${activeTab === "posts" ? "border-b-2 border-brand-yellow font-bold text-brand-yellow" : "text-text-lo hover:text-white"}`}
        >
          Posts
        </button>
        <button 
          onClick={() => setActiveTab("shop")}
          className={`flex-1 py-3 text-center transition-colors ${activeTab === "shop" ? "border-b-2 border-brand-yellow font-bold text-brand-yellow" : "text-text-lo hover:text-white"}`}
        >
          Shop
        </button>
      </div>

      {/* Tab Content */}

      {activeTab === "shop" && (
        <div className="py-12 text-center text-text-lo">
          Digital products coming soon!
        </div>
      )}

      {activeTab === "posts" && (
        <div className="grid grid-cols-3 gap-1">
        {posts.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-text-lo">
            No posts yet.
          </div>
        ) : (
          posts.map(post => (
            <div 
              key={post.id} 
              className="aspect-square bg-surface-dark relative group overflow-hidden cursor-pointer"
              onClick={() => {
                if (post.visibility === "private" && post.price) {
                  setSelectedPost(post);
                }
              }}
            >
              {post.visibility === "private" && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 backdrop-blur-sm transition-colors group-hover:bg-black/50">
                  <span className="text-2xl mb-1">🔒</span>
                  {post.price && <span className="text-xs font-bold text-brand-yellow bg-black/50 px-2 py-1 rounded">₹{post.price}</span>}
                </div>
              )}
              <div className="w-full h-full bg-text-lo/10 flex items-center justify-center">
                 {post.type === "video" ? "▶️" : "🖼️"}
              </div>
            </div>
          ))
        )}
      </div>
      )}

      <CheckoutSheet 
        isOpen={!!selectedPost || isCheckoutOpen}
        onClose={() => {
          setSelectedPost(null);
          setIsCheckoutOpen(false);
        }}
        title={selectedPost ? `Unlock exclusive content from ${creatorName}` : `Subscribe to ${creatorName}`}
        price={selectedPost?.price || subscriptionPrice}
        postId={selectedPost?.id}
        creatorId={creatorId}
        type={selectedPost ? "post" : "subscription"}
      />
    </>
  );
}
