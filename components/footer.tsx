"use client";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchStoreSettings, qk } from "@/lib/queries";
import dayjs from "dayjs";

export function Footer() {
  const { data: settings } = useQuery({
    queryKey: qk.storeSettings,
    queryFn: fetchStoreSettings,
    staleTime: 60_000,
  });

  const weekday = settings?.weekdayOpen && settings?.weekdayClose
    ? `${dayjs(`1970-01-01T${settings.weekdayOpen}`).format("h:mm A")} - ${dayjs(`1970-01-01T${settings.weekdayClose}`).format("h:mm A")}`
    : "7:00 - 19:00";
  const sunday = settings?.sundayOpen && settings?.sundayClose
    ? `${dayjs(`1970-01-01T${settings.sundayOpen}`).format("h:mm A")} - ${dayjs(`1970-01-01T${settings.sundayClose}`).format("h:mm A")}`
    : "7:00 - 12:00";

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Live Fresh</h3>
            <p className="text-background/80 text-sm mb-4">
              Your trusted local butcher for premium quality meats since 2000.
              We pride ourselves on freshness and exceptional service.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 6235628654</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>orders@freshcuts.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Shappumpady, Kakkanad, Kochi</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold mb-4">Store Hours</h4>
            <div className="space-y-2 text-sm text-background/80">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Mon-Sat: {weekday}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Sunday: {sunday}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <div>
                <a
                  href="/products"
                  className="hover:text-primary transition-colors"
                >
                  All Products
                </a>
              </div>
              <div>
                <a
                  href="/info"
                  className="hover:text-primary transition-colors"
                >
                  Cut Types Guide
                </a>
              </div>
              <div>
                <a
                  href="/cart"
                  className="hover:text-primary transition-colors"
                >
                  Your Cart
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-background/60">
          <p>&copy; 2024 Live Fresh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
