"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export function CategoryCards() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const data = await res.json();
        if (active) setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load categories", e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Fresh Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our premium selection of fresh meats
          </p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                href={`/products?category=${encodeURIComponent(category.id)}`}
                key={category.id}
                className="w-full flex flex-col items-center justify-center"
              >
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={300}
                  height={300}
                  className="object-cover category-image-hover aspect-square"
                />
                <span className="mt-3 text-sm md:text-base font-medium text-gray-900 text-center">
                  {category.name}
                </span>
                {/* <a
                  href={`https://wa.me/${
                    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
                  }?text=Interested%20in%20${encodeURIComponent(
                    category.name
                  )}%20category`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2"
                >
                  <Button size="sm" className="mt-2">
                    Book via WhatsApp
                  </Button>
                </a> */}
              </Link>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground">
                No categories available
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
