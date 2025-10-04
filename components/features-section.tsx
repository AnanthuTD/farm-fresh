import { Shield, Truck, Award, Leaf, Star } from "lucide-react";

const features = [
  {
    icon: Shield,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "Fresh Guarantee",
    description: "100% Fresh or Money Back",
  },
  {
    icon: Truck,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Free Delivery",
    description: "On Orders Within 2KM",
  },
  // {
  //   icon: Award,
  //   iconBg: "bg-secondary/20",
  //   iconColor: "text-secondary",
  //   title: "Certified Quality",
  //   description: "Premium Grade A",
  // },
  {
    icon: Leaf,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "100% Natural",
    description: "No Artificial Additives",
  },
  // {
  //   icon: Star,
  //   iconBg: "bg-yellow-100",
  //   iconColor: "text-yellow-500",
  //   title: "4.9/5 Rating",
  //   description: "From 2,500+ Reviews",
  // },
];

export function FeaturesSection() {
  return (
    <section className="py-8 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 ${feature.iconBg} rounded-full flex items-center justify-center`}
              >
                <feature.icon className={`${feature.iconColor} text-xl`} />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {feature.title}
                </div>
                <div className="text-sm text-gray-600">
                  {feature.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
