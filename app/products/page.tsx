import { ProductsGrid } from "@/components/products-grid"
import { ProductFiltersV2 } from "@/components/product-filters-v2"
import { Suspense } from "react"

export default function ProductsPage() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
          <p className="text-gray-600">
            Browse our selection of premium quality meats, all fresh and ready for delivery
          </p>
        </div>

        <Suspense fallback={<div>Loading filters...</div>}>
          <ProductFiltersV2 />
        </Suspense>

        <div className="py-6">
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductsGrid />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
