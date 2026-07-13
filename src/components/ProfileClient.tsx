"use client";

import { useState } from "react";
import { CheckoutSheet } from "./CheckoutSheet";
import { Button } from "./Button";
import { AccessCard } from "./AccessCard";
import { PostEngagement } from "./PostEngagement";
import { ShareButton } from "./ShareButton";
import { Package, Lock, Play, Image as ImageIcon, Sparkles } from "lucide-react";

interface Post {
  id: string;
  type: string;
  visibility: string;
  price: number | null;
  caption?: string | null;
  _count?: { likes: number; comments: number };
}

export function ProfileClient({ 
  posts, 
  creatorName, 
  handle,
  creatorId,
  subscriptionPrice,
  isSubscribed,
  initialIsFollowing,
  purchasedPostIds,
  fullCreator
}: { 
  posts: Post[], 
  creatorName: string, 
  handle: string,
  creatorId: string,
  subscriptionPrice: number,
  isSubscribed: boolean,
  initialIsFollowing?: boolean,
  purchasedPostIds?: string[],
  fullCreator?: any
}) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState<"posts" | "shop">("posts");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing || false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [showAccessCard, setShowAccessCard] = useState(false);

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
        <div className="flex items-center ml-2">
          <ShareButton 
            url={`/${handle}`} 
            title={creatorName} 
            text={`Check out ${creatorName} on EliteHub!`} 
            variant="icon"
          />
        </div>
      </div>

      <div className="mb-6">
        <Button 
          variant="secondary" 
          className="w-full border border-brand-yellow/30 bg-brand-yellow/5 hover:bg-brand-yellow/10 text-brand-yellow flex items-center justify-center gap-2"
          onClick={() => setShowAccessCard(true)}
        >
          <Sparkles size={18} /> Explore Benefits
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
                    <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center text-text-lo">
                      <Package size={24} />
                    </div>
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
                  <Lock size={24} className="mb-1 text-white" />
                  {post.price && <span className="text-xs font-bold text-brand-yellow bg-black/50 px-2 py-1 rounded">₹{post.price}</span>}
                </div>
              )}
              <div className="w-full h-full bg-text-lo/10 flex items-center justify-center text-text-lo">
                 {post.type === "video" ? <Play size={32} /> : <ImageIcon size={32} />}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex justify-center z-20" onClick={(e) => e.stopPropagation()}>
                <PostEngagement 
                  postId={post.id} 
                  initialLikes={post._count?.likes || 0} 
                  initialComments={post._count?.comments || 0} 
                />
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

      {/* Access Card Modal */}
      {showAccessCard && fullCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm mx-auto relative">
            <button 
              className="absolute -top-12 right-0 text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={() => setShowAccessCard(false)}
            >
              ✕
            </button>
            <AccessCard user={fullCreator} />
          </div>
        </div>
      )}
    </>
  );
}
