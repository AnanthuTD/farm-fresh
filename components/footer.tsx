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

  const weekday =
    settings?.weekdayOpen && settings?.weekdayClose
      ? `${dayjs(`1970-01-01T${settings.weekdayOpen}`).format(
          "h:mm A"
        )} - ${dayjs(`1970-01-01T${settings.weekdayClose}`).format("h:mm A")}`
      : "7:00 - 19:00";
  const sunday =
    settings?.sundayOpen && settings?.sundayClose
      ? `${dayjs(`1970-01-01T${settings.sundayOpen}`).format(
          "h:mm A"
        )} - ${dayjs(`1970-01-01T${settings.sundayClose}`).format("h:mm A")}`
      : "7:00 - 12:00";

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-brand-orange">
              Live Fresh
            </h3>
            <p className="text-white/80 text-sm mb-4">
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
                <a
                  href="tel:+916235628654"
                  className="hover:text-accent underline-offset-4 hover:underline"
                >
                  +91 6235628654
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:orders@freshcuts.com"
                  className="hover:text-accent underline-offset-4 hover:underline"
                >
                  orders@freshcuts.com
                </a>
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
            <div className="space-y-2 text-sm text-white/80">
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
                  className="hover:text-accent transition-colors"
                >
                  All Products
                </a>
              </div>
              <div>
                <a href="/info" className="hover:text-accent transition-colors">
                  Cut Types Guide
                </a>
              </div>
              <div>
                <a
                  href="https://wa.me/919123456789?text=Order%20from%20Cart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Your Cart (WhatsApp)
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/70">
          <p>&copy; 2024 Live Fresh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
