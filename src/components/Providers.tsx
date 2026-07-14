"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function Providers({ children, userTheme = "dark" }: { children: React.ReactNode, userTheme?: string }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={userTheme} enableSystem disableTransitionOnChange>
      {children}
      <Toaster position="bottom-center" theme="dark" richColors />
    </ThemeProvider>
  );
}
