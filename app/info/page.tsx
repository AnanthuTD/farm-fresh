import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  Shield,
  Truck,
  Award,
  Users,
} from "lucide-react";

export default function InfoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            About Fresh Cuts
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your trusted local butcher shop, delivering the freshest chicken,
            fish, and beef directly to your doorstep since 2015.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Our Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Fresh Cuts began as a small family business with a simple
                mission: to provide the highest quality meat products to our
                community. Over the years, we&apos;ve built strong relationships
                with local farms and suppliers, ensuring that every cut meets
                our strict standards for freshness and quality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Quality Promise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We guarantee the freshness of all our products. Every item is
                carefully selected, properly stored, and prepared by our
                experienced butchers. If you&apos;re not completely satisfied
                with your purchase, we&apos;ll make it right.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Delivery Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Delivery Areas
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Central Mumbai - Free delivery</li>
                  <li>• Bandra, Andheri, Juhu - ₹50</li>
                  <li>• Powai, Vikhroli, Ghatkopar - ₹75</li>
                  <li>• Thane, Navi Mumbai - ₹100</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Delivery Times
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Morning: 9 AM - 12 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Afternoon: 12 PM - 4 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Evening: 4 PM - 8 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                5000+
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">Happy Customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                8+ Years
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">In Business</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
                Same Day
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">Delivery Available</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Our Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Badge variant="secondary">Chicken</Badge>
                </h3>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Whole chicken</li>
                  <li>• Chicken breast</li>
                  <li>• Drumsticks & thighs</li>
                  <li>• Wings & liver</li>
                  <li>• Custom cuts available</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Badge variant="secondary">Fish</Badge>
                </h3>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Fresh pomfret</li>
                  <li>• Salmon fillets</li>
                  <li>• Prawns & shrimp</li>
                  <li>• Kingfish & mackerel</li>
                  <li>• Cleaned & filleted</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Badge variant="secondary">Beef</Badge>
                </h3>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Premium steaks</li>
                  <li>• Ground beef</li>
                  <li>• Beef ribs</li>
                  <li>• Roasts & brisket</li>
                  <li>• Marinated options</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      Visit Our Shop
                    </p>
                    <p className="text-muted-foreground">
                      123 Market Street, Bandra West
                      <br />
                      Mumbai, Maharashtra 400050
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Call Us</p>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-muted-foreground">
                      orders@freshcuts.com
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Store Hours
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Saturday</span>
                    <span>8:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>9:00 AM - 7:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
