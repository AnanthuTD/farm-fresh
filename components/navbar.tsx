"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Bell, Menu, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Mock data for store settings - replace with your actual data fetching
const mockStoreSettings = {
  offDates: [] as string[],
};

// Server-side timestamp to ensure consistent date calculations
const SERVER_TIMESTAMP = new Date().toISOString();

export function Navbar() {
  const { state } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side only logic runs after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mock query - replace with your actual query
  const { data: settings } = useQuery({
    queryKey: ["storeSettings"],
    queryFn: () => Promise.resolve(mockStoreSettings),
    staleTime: 60_000,
    initialData: mockStoreSettings, // Provide initial data for SSR
  });

  const offDates: string[] = settings?.offDates || [];

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const upcoming = useMemo(() => {
    const today = new Date(SERVER_TIMESTAMP); // Use server timestamp for consistency
    const dates = offDates
      .map((d) => ({ raw: d, date: new Date(d + "T00:00:00") }))
      .filter(
        (x) =>
          x.date >=
          new Date(today.getFullYear(), today.getMonth(), today.getDate())
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
    return dates;
  }, [offDates]);

  const offTomorrow = useMemo(() => {
    const t = new Date(SERVER_TIMESTAMP);
    t.setDate(t.getDate() + 1);
    const yyyy = t.getFullYear();
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    const iso = `${yyyy}-${mm}-${dd}`;
    return offDates.includes(iso);
  }, [offDates]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop/meat", label: "Meat" },
    { href: "/shop/chicken", label: "Chicken" },
    { href: "/shop/seafood", label: "Seafood" },
  ];

  // Avoid rendering until client-side to prevent hydration mismatch
  if (!isClient) {
    return null; // Or a minimal placeholder matching server output
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="w-full px-4">
        <div className="flex h-16 justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <Image
                  src="/nav-icon.jpg"
                  alt="Live Fresh Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                  priority
                />
              </div>
              <span className="font-bebas-neue font-bold text-xl text-brand-red">
                Live Fresh
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-brand-red transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-red transition-all duration-200 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Search - Mobile */}
            <button className="md:hidden p-2 text-gray-700 hover:text-brand-red transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className={`relative bg-transparent text-gray-700 hover:bg-transparent hover:text-brand-red border-none shadow-none ${
                  offTomorrow ? "animate-bounce ring-2 ring-red-500" : ""
                }`}
                onClick={() => setShowNotif((s) => !s)}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {upcoming.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-red text-white text-xs flex items-center justify-center">
                    {upcoming.length}
                  </span>
                )}
              </Button>
              {showNotif && (
                <div className="absolute right-0 mt-2 w-64 bg-popover text-popover-foreground border rounded-md shadow-lg p-3 z-50">
                  <div className="font-medium mb-2">Upcoming Off Days</div>
                  {upcoming.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No upcoming off days
                    </div>
                  ) : (
                    <ul className="space-y-1 text-sm">
                      {upcoming.map((item) => (
                        <li key={item.raw} className="text-foreground">
                          {new Date(item.raw).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent hover:bg-transparent text-gray-700 hover:text-brand-red border-none shadow-none relative"
              onClick={() => (window.location.href = "/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-red text-white text-xs flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden bg-transparent border-none shadow-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-200 ease-in-out",
            isMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col space-y-2 pt-4 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground font-medium py-2 px-3 rounded-md hover:bg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
