import { Hero } from "@/components/hero"
import { CategoryCards } from "@/components/category-cards"
import { DeliverySection } from "@/components/delivery-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <CategoryCards />
      <DeliverySection />
      <Footer />
    </div>
  )
}
