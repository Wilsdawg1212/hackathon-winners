import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SafeProvider } from "@/contexts/SafeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GroupSafe - Secure Treasury Management",
  description: "A lightweight control layer for shared cryptocurrency treasuries. Make everyday payments fast and safe while maintaining security through policy enforcement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SafeProvider>
          {children}
        </SafeProvider>
      </body>
    </html>
  );
}
