"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchCategories, fetchProducts, qk } from "@/lib/queries"
import Image from "next/image"
import Link from "next/link"

interface ProductItem {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  available: boolean
}

interface CategoryItem {
  id: string
  name: string
  alwaysAvailable?: boolean
  availableDays?: number[]
  availableTimeStart?: string
  availableTimeEnd?: string
}

function isCategoryAvailableNow(c?: CategoryItem | null): boolean {
  if (!c) return true
  if (c.alwaysAvailable || c.alwaysAvailable === undefined) return true
  const now = new Date()
  const day = now.getDay() // 0-6
  const allowedDays = c.availableDays && c.availableDays.length > 0 ? c.availableDays : undefined
  if (allowedDays && !allowedDays.includes(day)) return false
  if (c.availableTimeStart && c.availableTimeEnd) {
    const [sh, sm] = c.availableTimeStart.split(":").map((n) => parseInt(n, 10))
    const [eh, em] = c.availableTimeEnd.split(":").map((n) => parseInt(n, 10))
    const minutes = now.getHours() * 60 + now.getMinutes()
    const start = sh * 60 + (sm || 0)
    const end = eh * 60 + (em || 0)
    return minutes >= start && minutes <= end
  }
  return true
}

export function ProductsGrid() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get("category")

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: qk.products(true),
    queryFn: () => fetchProducts(true) as Promise<ProductItem[]>,
    staleTime: 60_000,
  })
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: qk.categories,
    queryFn: () => fetchCategories() as Promise<CategoryItem[]>,
    staleTime: 60_000,
  })

  const categoriesById = useMemo(() => {
    const map = new Map<string, CategoryItem>()
    categories.forEach((c) => map.set(c.id, c))
    return map
  }, [categories])

  const filtered = useMemo(() => {
    let list = products
    if (categoryFilter && categoryFilter !== "all") {
      list = list.filter((p) => p.category === categoryFilter)
    }
    return list
  }, [products, categoryFilter])

  const loading = loadingProducts || loadingCategories

  if (!loading && filtered.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(loading ? Array.from({ length: 6 }).map((_, i) => ({ id: `s-${i}` })) : filtered).map((product: any) => {
        const cat = categoriesById.get(product.category) || null
        const availableNow = product?.available !== false && isCategoryAvailableNow(cat)
        return (
          <Card
            key={product.id}
            className={`group transition-all duration-300 ${availableNow ? "hover:shadow-lg" : "opacity-50 grayscale"}`}
          >
            <Link href={availableNow ? `/products/${product.id}` : "#"} className={availableNow ? "" : "pointer-events-none"}>
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                {loading ? (
                  <div className="w-full h-full bg-muted animate-pulse" />
                ) : (
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                {!loading && (
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                    {product.category}
                  </Badge>
                )}
              </div>

              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {loading ? <span className="inline-block h-5 w-40 bg-muted animate-pulse rounded" /> : product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {loading ? <span className="inline-block h-4 w-64 bg-muted animate-pulse rounded" /> : product.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">
                    {loading ? <span className="inline-block h-6 w-16 bg-muted animate-pulse rounded" /> : <>₹{product.price}</>}
                  </span>
                  {!loading && (
                    <Button variant="outline" className="flex-shrink-0 bg-transparent">
                      View Details
                    </Button>
                  )}
                </div>
                {!availableNow && !loading && (
                  <div className="mt-2 text-xs text-muted-foreground">Currently unavailable</div>
                )}
              </CardContent>
            </Link>
          </Card>
        )
      })}
    </div>
  )
}
