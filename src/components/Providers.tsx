"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

function DynamicToaster() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  const currentTheme = theme === 'system' ? systemTheme : theme;
  return <Toaster position="bottom-center" theme={currentTheme as any || 'dark'} richColors />;
}

export function Providers({ children, userTheme = "dark" }: { children: React.ReactNode, userTheme?: string }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={userTheme} enableSystem disableTransitionOnChange>
      {children}
      <DynamicToaster />
    </ThemeProvider>
  );
}
