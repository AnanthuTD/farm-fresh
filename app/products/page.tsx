import { ProductsGrid } from "@/components/products-grid"
import { ProductFilters } from "@/components/product-filters"
import { Suspense } from "react"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Products</h1>
        <p className="text-lg text-muted-foreground">
          Browse our selection of premium quality meats, all fresh and ready for delivery
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ProductFilters />
          </Suspense>
        </aside>

        <main className="flex-1">
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductsGrid />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
