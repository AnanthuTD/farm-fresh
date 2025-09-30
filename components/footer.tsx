import { Phone, Mail, MapPin, Clock } from "lucide-react";

export function Footer() {
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
                <span>Mon-Sat: 7AM - 7PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Sunday: 7AM - 12PM</span>
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
