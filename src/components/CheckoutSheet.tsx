"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";
import Script from "next/script";

interface CheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  price: number;
  postId?: string;
  creatorId?: string;
  type?: "post" | "subscription";
}

export function CheckoutSheet({ isOpen, onClose, title, price, postId, creatorId, type = "post" }: CheckoutSheetProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create order on our backend
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: type, 
          targetId: type === "subscription" ? creatorId : postId 
        })
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      // 2. Open Razorpay Checkout Widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock", 
        amount: data.amount,
        currency: "INR",
        name: "EliteHub",
        description: title,
        order_id: data.orderId,
        handler: function (response: any) {
          // Success! Webhook will handle the DB update in the background.
          // For UX, we can optimistically reload the page or show success.
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          window.location.reload();
        },
        theme: {
          color: "#F5C518" // Brand Yellow
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Failed to initialize payment.");
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
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface-dark border-t border-white/10 rounded-t-3xl p-6 z-50 pb-safe shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
              
              <h2 className="font-display text-2xl font-bold text-elite-white mb-2">Unlock Content</h2>
              <p className="text-text-lo mb-6">{title}</p>
              
              <div className="flex justify-between items-center bg-black/50 p-4 rounded-xl mb-8 border border-white/5">
                <span className="font-bold">Total Amount</span>
                <span className="font-display text-2xl font-bold text-brand-yellow">₹{price}</span>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Pay via UPI"}
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
