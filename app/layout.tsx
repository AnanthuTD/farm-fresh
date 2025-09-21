import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/navbar";
import { Suspense } from "react";
import AnalyticsProvider from "@/components/analytics-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Fresh Cuts Butcher Shop",
  description: "Premium quality chicken, fish, and beef with home delivery",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <CartProvider>
          <AnalyticsProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Navbar />
              <main className="min-h-screen">{children}</main>
            </Suspense>
          </AnalyticsProvider>
        </CartProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
