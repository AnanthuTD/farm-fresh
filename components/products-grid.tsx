"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { products } from "@/lib/cart-context"

export function ProductsGrid() {
  const searchParams = useSearchParams()

  const category = searchParams.get("category")
  const priceRange = searchParams.get("price")

  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by category
    if (category && category !== "all") {
      filtered = filtered.filter((product) => product.category === category)
    }

    // Filter by price range
    if (priceRange && priceRange !== "all") {
      filtered = filtered.filter((product) => {
        if (priceRange === "0-500") return product.price < 500
        if (priceRange === "500-1000") return product.price >= 500 && product.price <= 1000
        if (priceRange === "1000+") return product.price > 1000
        return true
      })
    }

    return filtered
  }, [category, priceRange])

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
          <Link href={`/products/${product.id}`}>
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Badge>
            </div>

            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">
                  ₹{product.price}/{product.weightUnit}
                </span>
                <Button variant="outline" className="flex-shrink-0 bg-transparent">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  )
}
