"use client";

import { useState } from "react";
import { CheckoutSheet } from "./CheckoutSheet";

interface Post {
  id: string;
  type: string;
  visibility: string;
  price: number | null;
}

export function ProfileClient({ posts, creatorName }: { posts: Post[], creatorName: string }) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <>
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

      <CheckoutSheet 
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        title={`Unlock exclusive content from ${creatorName}`}
        price={selectedPost?.price || 0}
        postId={selectedPost?.id}
      />
    </>
  );
}
