"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, Send, Bookmark, Eye, Flag, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ShareButton } from "./ShareButton";

interface PostEngagementProps {
  readonly postId: string;
  readonly initialLikes?: number;
  readonly initialComments?: number;
  readonly initialSaves?: number;
  readonly initialViews?: number;
  readonly isLikedInitially?: boolean;
  readonly isSavedInitially?: boolean;
}

export function PostEngagement({ 
  postId, 
  initialLikes = 0, 
  initialComments = 0, 
  initialSaves = 0,
  initialViews = 0,
  isLikedInitially = false,
  isSavedInitially = false
}: PostEngagementProps) {
  const [liked, setLiked] = useState(isLikedInitially);
  const [likes, setLikes] = useState(initialLikes);
  const [saved, setSaved] = useState(isSavedInitially);
  const [saves, setSaves] = useState(initialSaves);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    if (!hasViewed) {
      setHasViewed(true);
      fetch(`/api/posts/${postId}/view`, { method: "POST" }).catch(() => {});
    }
  }, [postId, hasViewed]);

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
    } catch {
      setLiked(wasLiked);
      setLikes(prev => wasLiked ? prev + 1 : prev - 1);
    }
  };

  const handleSave = async () => {
    const wasSaved = saved;
    setSaved(!wasSaved);
    setSaves(prev => wasSaved ? prev - 1 : prev + 1);

    try {
      const res = await fetch(`/api/posts/${postId}/save`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to save post");
      const data = await res.json();
      setSaved(data.saved);
    } catch {
      setSaved(wasSaved);
      setSaves(prev => wasSaved ? prev + 1 : prev - 1);
    }
  };

  const submitReport = async () => {
    if (!reportReason) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, reason: reportReason })
      });
      if (res.ok) {
        setReportSuccess(true);
        setTimeout(() => {
          setShowReport(false);
          setReportSuccess(false);
          setReportReason("");
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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
        <button onClick={handleSave} className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 group">
          <Bookmark className={`w-6 h-6 transition-colors ${saved ? "fill-brand-yellow text-brand-yellow" : "text-white group-hover:text-white/80"}`} />
          <span className="font-bold text-sm">{saves}</span>
        </button>
        <div className="flex items-center gap-2 text-text-lo">
          <Eye className="w-5 h-5" />
          <span className="font-bold text-sm">{initialViews}</span>
        </div>
        <button onClick={() => setShowReport(true)} className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 group ml-2">
          <Flag className="w-5 h-5 text-text-lo hover:text-white transition-colors" />
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
            <motion.button 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              aria-label="Close comments"
              onClick={() => setShowComments(false)}
              className="fixed inset-0 w-full h-full bg-black/80 backdrop-blur-sm z-[60] cursor-default border-none outline-none"
            />
            
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[70vh] bg-surface border-t border-white/10 rounded-t-3xl p-4 sm:p-6 z-[60] flex flex-col shadow-2xl pb-safe"
            >
              <button 
                type="button"
                aria-label="Close comments panel"
                onClick={() => setShowComments(false)}
                className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 shrink-0 cursor-pointer border-none outline-none block" 
              />
              
              <h3 className="font-display text-xl font-bold mb-4 shrink-0">Comments</h3>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 custom-scrollbar">
                {comments.length === 0 ? (
                  <p className="text-text-lo text-center mt-10">No comments yet. Be the first!</p>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center overflow-hidden shrink-0">
                        {c.user?.image || c.user?.photo ? (
                           <img src={c.user.photo || c.user.image} alt="User" className="w-full h-full object-cover" />
                        ) : (
                           <span className="text-xs font-bold text-text-lo">{c.user?.name?.charAt(0) || "?"}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-sm text-text-hi">{c.user?.name || "Anonymous"}</span>
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

      <AnimatePresence>
        {showReport && (
          <>
            <motion.button 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowReport(false)}
              className="fixed inset-0 w-full h-full bg-black/80 backdrop-blur-sm z-[70] cursor-default border-none outline-none"
            />
            
            <motion.div 
              initial={{ y: "100%", opacity: 0 }} 
              animate={{ y: "-50%", top: "50%", opacity: 1 }} 
              exit={{ y: "100%", opacity: 0 }}
              className="fixed left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-96 bg-surface border border-white/10 rounded-3xl p-6 z-[70] flex flex-col shadow-2xl"
            >
              {reportSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    ✓
                  </div>
                  <h3 className="font-bold text-xl mb-2">Report Submitted</h3>
                  <p className="text-text-lo text-sm">Thanks for keeping the community safe. Our team will review this.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="text-red-500 w-6 h-6" />
                    <h3 className="font-display text-xl font-bold">Report Content</h3>
                  </div>
                  
                  <p className="text-sm text-text-lo mb-4">Why are you reporting this post?</p>
                  
                  <div className="space-y-2 mb-6">
                    {["Spam", "Inappropriate", "Copyright Violation", "Other"].map(reason => (
                      <label key={reason} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-black/20 cursor-pointer hover:bg-white/5 transition-colors">
                        <input 
                          type="radio" 
                          name="reportReason" 
                          value={reason}
                          checked={reportReason === reason}
                          onChange={(e) => setReportReason(e.target.value)}
                          className="w-4 h-4 accent-brand-yellow"
                        />
                        <span className="text-sm font-bold">{reason}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 mt-auto">
                    <button 
                      className="flex-1 py-3 rounded-full font-bold text-sm bg-white/5 hover:bg-white/10 transition-colors"
                      onClick={() => setShowReport(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="flex-1 py-3 rounded-full font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                      onClick={submitReport}
                      disabled={!reportReason || loading}
                    >
                      {loading ? "Submitting..." : "Report"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
