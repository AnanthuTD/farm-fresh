"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"

const categories = [
  { id: "all", name: "All Products" },
  { id: "chicken", name: "Chicken" },
  { id: "fish", name: "Fish" },
  { id: "beef", name: "Beef" },
]

const priceRanges = [
  { id: "all", name: "All Prices" },
  { id: "0-500", name: "Under ₹500" },
  { id: "500-1000", name: "₹500 - ₹1000" },
  { id: "1000+", name: "Above ₹1000" },
]

export function ProductFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category") || "all"
  const currentPriceRange = searchParams.get("price") || "all"

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === "all") {
        params.delete(name)
      } else {
        params.set(name, value)
      }
      return params.toString()
    },
    [searchParams],
  )

  const handleCategoryChange = (categoryId: string) => {
    router.push(pathname + "?" + createQueryString("category", categoryId))
  }

  const handlePriceChange = (priceId: string) => {
    router.push(pathname + "?" + createQueryString("price", priceId))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={currentCategory === category.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {priceRanges.map((range) => (
            <Button
              key={range.id}
              variant={currentPriceRange === range.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handlePriceChange(range.id)}
            >
              {range.name}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
