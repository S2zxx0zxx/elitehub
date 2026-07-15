"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

function DynamicToaster() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return <Toaster position="bottom-center" theme="light" richColors />;
}

export function Providers({ children, userTheme = "light" }: { children: React.ReactNode, userTheme?: string }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
      {children}
      <DynamicToaster />
    </ThemeProvider>
  );
}
