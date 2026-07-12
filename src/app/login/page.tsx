"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/Button";
import { Card, CardContent } from "@/components/Card";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-brand-yellow mb-2">EliteHub</h1>
          <p className="text-text-lo text-lg">India ke creators ka apna platform</p>
        </div>

        <Card>
          <CardContent className="space-y-6 flex flex-col items-center py-8">
            <h2 className="font-display text-xl font-bold text-center">
              Welcome back
            </h2>
            
            <Button 
              onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
              className="w-full gap-3 py-6"
              size="lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google se continue karo
            </Button>
            
            <p className="text-xs text-text-lo text-center mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
