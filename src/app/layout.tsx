import {ClerkProvider} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Poppins, Inter, Fraunces } from "next/font/google";
import "@/styles/tokens.css";
import { Providers } from "@/components/Providers";


const display = Poppins({ weight: ["500","600","700","800"], 
  subsets: ["latin"], 
  variable: "--font-display" 
});

const body = Inter({ 
  subsets: ["latin"], 
  variable: "--font-body" 
});

const serif = Fraunces({
  weight: ["500","600","700","900"],
  subsets: ["latin"],
  variable: "--font-serif"
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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${display.variable} ${body.variable} ${serif.variable} font-body pb-24`}>
          <Providers userTheme="light">
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}