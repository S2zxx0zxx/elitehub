"use client";

import { useState } from "react";
import { CheckoutSheet } from "./CheckoutSheet";
import { Button } from "./Button";

interface Post {
  id: string;
  type: string;
  visibility: string;
  price: number | null;
  caption?: string | null;
}

export function ProfileClient({ 
  posts, 
  creatorName, 
  handle,
  creatorId,
  subscriptionPrice,
  isSubscribed,
  initialIsFollowing,
  purchasedPostIds
}: { 
  posts: Post[], 
  creatorName: string, 
  handle: string,
  creatorId: string,
  subscriptionPrice: number,
  isSubscribed: boolean,
  initialIsFollowing?: boolean,
  purchasedPostIds?: string[]
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

  const feedPosts = posts.filter(p => p.type !== "product");
  const shopProducts = posts.filter(p => p.type === "product");

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
        <div className="space-y-4">
          {shopProducts.length === 0 ? (
            <div className="py-12 text-center text-text-lo">
              No products yet.
            </div>
          ) : (
            shopProducts.map(product => {
              const isPurchased = purchasedPostIds?.includes(product.id);
              return (
                <div key={product.id} className="bg-surface-dark p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center text-2xl">📦</div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{product.caption || "Digital Product"}</h4>
                      <p className="text-sm font-bold text-brand-yellow">₹{product.price || 0}</p>
                    </div>
                  </div>
                  <div>
                    {isPurchased ? (
                      <a href={`/api/media/${product.id}`} download target="_blank" rel="noreferrer" className="inline-block bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-bold text-sm transition-colors">
                        Download
                      </a>
                    ) : (
                      <Button onClick={() => setSelectedPost(product)}>Buy</Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === "posts" && (
        <div className="grid grid-cols-3 gap-1">
        {feedPosts.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-text-lo">
            No posts yet.
          </div>
        ) : (
          feedPosts.map(post => (
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
