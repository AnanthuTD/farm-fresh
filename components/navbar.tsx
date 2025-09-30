"use client";

import Link from "next/link";
import { ShoppingCart, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchStoreSettings, qk } from "@/lib/queries";

export function Navbar() {
  const { state } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const { data: settings } = useQuery({
    queryKey: qk.storeSettings,
    queryFn: fetchStoreSettings,
    staleTime: 60_000,
  });
  const offDates: string[] = (settings?.offDates as string[] | undefined) || [];

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  // offDates loaded by React Query

  const upcoming = useMemo(() => {
    const today = new Date();
    const dates = offDates
      .map((d) => ({ raw: d, date: new Date(d + "T00:00:00") }))
      .filter((x) => x.date >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
    return dates;
  }, [offDates]);

  const offTomorrow = useMemo(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    const yyyy = t.getFullYear();
    const mm = String(t.getMonth() + 1).padStart(2, '0');
    const dd = String(t.getDate()).padStart(2, '0');
    const iso = `${yyyy}-${mm}-${dd}`;
    return offDates.includes(iso);
  }, [offDates]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/cart", label: "Cart" },
    { href: "/info", label: "Info" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img
                src="/nav-icon.jpg"
                alt="Live Fresh Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bebas-neue font-bold text-xl text-foreground">
              Live Fresh
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Notifications + Cart */}
          <div className="flex items-center space-x-4 relative">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className={`relative bg-transparent ${offTomorrow ? 'animate-bounce ring-2 ring-red-500' : ''}`}
                onClick={() => setShowNotif((s) => !s)}
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {upcoming.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 h-5 min-w-5 px-1 flex items-center justify-center p-0 text-xs"
                  >
                    {upcoming.length}
                  </Badge>
                )}
              </Button>
              {showNotif && (
                <div className="absolute right-0 mt-2 w-64 bg-popover text-popover-foreground border rounded-md shadow-lg p-3 z-50">
                  <div className="font-medium mb-2">Upcoming Off Days</div>
                  {upcoming.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No upcoming off days</div>
                  ) : (
                    <ul className="space-y-1 text-sm">
                      {upcoming.map((x) => (
                        <li key={x.raw}>{x.raw}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <Link href="/cart">
              <Button
                variant="outline"
                size="sm"
                className="relative bg-transparent"
              >
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden bg-transparent"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-200 ease-in-out",
            isMenuOpen ? "max-h-48 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col space-y-2 pt-4 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
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
