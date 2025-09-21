import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: "chicken",
    name: "Fresh Chicken",
    description: "Farm-fresh chicken with various cut options",
    image: "/fresh-chicken-cuts-on-wooden-cutting-board.jpg",
    href: "/products?category=chicken",
  },
  {
    id: "fish",
    name: "Fresh Fish",
    description: "Daily catch with cleaning and filleting services",
    image: "/fresh-fish-display-on-ice-market.jpg",
    href: "/products?category=fish",
  },
  {
    id: "beef",
    name: "Premium Beef",
    description: "High-quality beef cuts for every occasion",
    image: "/premium-beef-cuts-marbled-meat-butcher.jpg",
    href: "/products?category=beef",
  },
]

export function CategoryCards() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Fresh Categories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our premium selection of fresh meats, all sourced from trusted local suppliers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">{category.name}</h3>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <Link href={category.href}>
                  <Button className="w-full">Shop {category.name}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
