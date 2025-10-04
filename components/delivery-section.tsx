import { Card, CardContent } from "@/components/ui/card";
import { Truck, Clock, Shield, Phone } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Home Delivery",
    description: "Free delivery on all orders within 2km radius",
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "100% fresh guarantee or your money back",
  },
  {
    icon: Phone,
    title: "24/7 Support",
    description: "Call us anytime for orders and queries",
  },
];

export function DeliverySection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Live Fresh?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We&apos;re committed to delivering the freshest meats with
            exceptional service
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center border-secondary/40 border shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
