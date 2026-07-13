"use client";

import { useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ShareButton } from "./ShareButton";

interface PostEngagementProps {
  readonly postId: string;
  readonly initialLikes?: number;
  readonly initialComments?: number;
  readonly isLikedInitially?: boolean;
}

export function PostEngagement({ postId, initialLikes = 0, initialComments = 0, isLikedInitially = false }: PostEngagementProps) {
  const [liked, setLiked] = useState(isLikedInitially);
  const [likes, setLikes] = useState(initialLikes);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Note: To truly reflect isLikedInitially, we need the parent to pass it.
  // But for now, we just allow the user to toggle it.
  
  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to like post");
      const data = await res.json();
      setLiked(data.liked);
      // In a real app we might fetch the exact count again
    } catch {
      // Revert on error
      setLiked(wasLiked);
      setLikes(prev => wasLiked ? prev + 1 : prev - 1);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comment`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
        setCommentsCount(data.length);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenComments = () => {
    setShowComments(true);
    fetchComments();
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment })
      });
      
      if (res.ok) {
        const addedComment = await res.json();
        setComments([addedComment, ...comments]);
        setCommentsCount(prev => prev + 1);
        setNewComment("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 mt-4">
        <button onClick={handleLike} className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 group">
          <Heart className={`w-6 h-6 transition-colors ${liked ? "fill-brand-yellow text-brand-yellow" : "text-white group-hover:text-white/80"}`} />
          <span className="font-bold text-sm">{likes}</span>
        </button>
        <button onClick={handleOpenComments} className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 group">
          <MessageCircle className="w-6 h-6 text-white group-hover:text-white/80" />
          <span className="font-bold text-sm">{commentsCount}</span>
        </button>
        <div className="ml-auto flex items-center">
          <ShareButton 
            url={`/explore`} 
            title="Post on EliteHub" 
            text="Check out this post on EliteHub!" 
            variant="icon"
          />
        </div>
      </div>

      <AnimatePresence>
        {showComments && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowComments(false)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowComments(false); }}
              role="button"
              tabIndex={0}
              aria-label="Close comments"
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[70vh] bg-surface-dark border-t border-white/10 rounded-t-3xl p-4 sm:p-6 z-[60] flex flex-col shadow-2xl pb-safe"
            >
              <div 
                className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 shrink-0 cursor-pointer" 
                onClick={() => setShowComments(false)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowComments(false); }}
                role="button"
                tabIndex={0}
                aria-label="Close comments panel"
              />
              
              <h3 className="font-display text-xl font-bold mb-4 shrink-0">Comments</h3>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 custom-scrollbar">
                {comments.length === 0 ? (
                  <p className="text-text-lo text-center mt-10">No comments yet. Be the first!</p>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center overflow-hidden shrink-0">
                        {c.user?.image || c.user?.photo ? (
                           <img src={c.user.photo || c.user.image} alt="User" className="w-full h-full object-cover" />
                        ) : (
                           <span className="text-xs font-bold text-text-lo">{c.user?.name?.charAt(0) || "?"}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-sm text-elite-white">{c.user?.name || "Anonymous"}</span>
                          {c.user?.tickTier === "gold" && <span className="text-brand-yellow text-xs">✓</span>}
                        </div>
                        <p className="text-sm text-text-lo mt-0.5 break-words">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <form onSubmit={submitComment} className="shrink-0 relative">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  className="w-full bg-black/40 border border-white/10 rounded-full py-3 px-5 pr-12 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  disabled={!newComment.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-brand-yellow text-black rounded-full disabled:opacity-50 transition-opacity"
                >
                  <Send className="w-4 h-4 ml-[-2px]" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
