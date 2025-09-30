import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "@/app/fonts/fonts.css";
import { CartProvider } from "@/lib/cart-context";
import NavbarGuard from "@/components/navbar-guard";
import { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import AnalyticsProvider from "@/components/analytics-provider";
import { Toaster } from "@/components/ui/sonner";
import { getFontClassNames } from "@/app/fonts/fonts";
import QueryProvider from "@/components/query-provider";

export const metadata: Metadata = {
  title: "Live Fresh",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-title" content="Live Fresh" />
      </head>
      <body className={`${getFontClassNames()}`}>
        <NuqsAdapter>
          <QueryProvider>
            <CartProvider>
              <AnalyticsProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  <NavbarGuard />
                  <main className="min-h-screen">{children}</main>
                </Suspense>
              </AnalyticsProvider>
            </CartProvider>
            <Analytics />
            <Toaster />
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
