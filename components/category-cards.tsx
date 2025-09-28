"use client";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    id: "chicken",
    name: "Fresh Chicken",
    description: "Farm-fresh chicken with various cut options",
    image: "/category/chicken.png",
    href: "/products?category=chicken",
  },
  {
    id: "beef",
    name: "Premium Beef",
    description: "High-quality beef cuts for every occasion",
    image: "/category/fish.png",
    href: "/products?category=beef",
  },
  {
    id: "fish",
    name: "Fresh Fish",
    description: "Daily catch with cleaning and filleting services",
    image: "/category/beef.png",
    href: "/products?category=fish",
  },
];

export function CategoryCards() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Fresh Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our premium selection of fresh meats
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              href={category.href}
              key={category.id}
              className="w-full justify-center flex items-center"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                width={300}
                height={300}
                className="object-cover category-image-hover aspect-square"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
