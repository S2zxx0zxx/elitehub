import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "@/styles/tokens.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${display.variable} ${body.variable} font-body pb-24`}>
        {children}
      </body>
    </html>
  );
}
