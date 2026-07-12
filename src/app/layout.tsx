import {ClerkProvider} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "@/styles/tokens.css";
import { Providers } from "@/components/Providers";
import { getDbUser } from "@/lib/auth";

const display = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-display" 
});

const body = Inter({ 
  subsets: ["latin"], 
  variable: "--font-body" 
});

export const metadata: Metadata = {
  title: "EliteHub",
  description: "India ke creators, seedha apne fans se kamayein",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getDbUser();
  const theme = user?.theme === "light" ? "light" : "dark";

  return (
    <html lang="en" className={theme}>
      <body className={`${display.variable} ${body.variable} font-body pb-24`}>
        <ClerkProvider>
          <Providers>
          {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}