"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";
import Script from "next/script";
import { toast } from "sonner";

interface CheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  price: number;
  postId?: string;
  creatorId?: string;
  type?: "post" | "subscription";
  subscriptionPrice?: number;
}

export function CheckoutSheet({ isOpen, onClose, title, price, postId, creatorId, type = "post", subscriptionPrice }: CheckoutSheetProps) {
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"post" | "subscription">(type);

  useEffect(() => {
    setSelectedMode(type);
  }, [type]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create order on our backend
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: selectedMode, 
          targetId: selectedMode === "subscription" ? creatorId : postId 
        })
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      // 2. Open Razorpay Checkout Widget
      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock", 
        amount: data.amount,
        currency: "INR",
        name: "EliteHub",
        description: title,
        handler: function (response: any) {
          // Success! Webhook will handle the DB update in the background.
          toast.success(`Payment successful!`);
          setTimeout(() => window.location.reload(), 1000);
        },
        theme: {
          color: "#F5C518" // Brand Yellow
        }
      };

      if (data.subscriptionId) {
        options.subscription_id = data.subscriptionId;
      } else {
        options.order_id = data.orderId;
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      toast.error("Failed to initialize payment.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface border-t border-white/10 rounded-t-3xl p-6 z-50 pb-safe shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
              
              <h2 className="font-display text-2xl font-bold text-text-hi mb-2">{type === "post" ? "Unlock Content" : "Subscribe"}</h2>
              <p className="text-text-lo mb-6">{title}</p>
              
              <div className="space-y-4 mb-8">
                {type === "post" && (
                  <div 
                    className={`p-4 rounded-xl border cursor-pointer transition-colors ${selectedMode === "post" ? "bg-black/50 border-brand-yellow" : "bg-black/20 border-white/5 hover:border-white/20"}`}
                    onClick={() => setSelectedMode("post")}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-text-hi">One-time Unlock</span>
                      <span className="font-display text-xl font-bold text-brand-yellow">₹{price}</span>
                    </div>
                    <p className="text-xs text-text-lo">Lifetime access to this post only.</p>
                  </div>
                )}
                
                {(type === "subscription" || (type === "post" && subscriptionPrice)) && (
                  <div 
                    className={`p-4 rounded-xl border cursor-pointer transition-colors relative overflow-hidden ${selectedMode === "subscription" ? "bg-black/50 border-brand-yellow" : "bg-black/20 border-white/5 hover:border-white/20"}`}
                    onClick={() => setSelectedMode("subscription")}
                  >
                    {type === "post" && selectedMode === "subscription" && (
                      <div className="absolute top-0 right-0 bg-brand-yellow text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">RECOMMENDED</div>
                    )}
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-text-hi">Subscribe</span>
                      <span className="font-display text-xl font-bold text-brand-yellow">₹{type === "subscription" ? price : subscriptionPrice}<span className="text-sm text-text-lo font-normal">/mo</span></span>
                    </div>
                    <p className="text-xs text-text-lo">Unlock ALL premium content and support the creator.</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Pay ₹${selectedMode === "post" ? price : (type === "subscription" ? price : subscriptionPrice)} via UPI`}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
              
              <p className="text-center text-xs text-text-lo mt-6 flex items-center justify-center gap-1">
                🔒 Secured by Razorpay
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
