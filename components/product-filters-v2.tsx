"use client";

import { useQueryState, parseAsString } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, qk } from "@/lib/queries";
import { useMemo } from "react";
import { Beef, Fish, Drumstick, EggFried, Egg, BeefIcon } from "lucide-react";

interface CategoryItem { 
  id: string; 
  name: string;
  icon?: React.ReactNode;
}

const categoryIcons: Record<string, React.ReactNode> = {
  "chicken": <Drumstick className="w-4 h-4" />,
  "beef": <Beef className="w-4 h-4" />,
  "fish": <Fish className="w-4 h-4" />,
  "meat": <BeefIcon className="w-4 h-4" />,
  "mutton": <Beef className="w-4 h-4 transform scale-x-[-1]" />,
  "eggs": <Egg className="w-4 h-4" />,
  "ready to cook": <EggFried className="w-4 h-4" />,
};

export function ProductFiltersV2() {
  const [category, setCategory] = useQueryState(
    "category",
    parseAsString.withDefault("all")
  );

  const { data: cats = [], isLoading } = useQuery({
    queryKey: qk.categories,
    queryFn: () => fetchCategories() as Promise<CategoryItem[]>,
    staleTime: 60_000,
  });

  const categories = useMemo(() => [
    { id: "all", name: "All Products" },
    ...cats.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: categoryIcons[cat.name.toLowerCase()] || null
    }))
  ], [cats]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      setCategory(null);
    } else {
      setCategory(categoryId);
    }
  };

  if (isLoading) {
    return (
      <section className="py-4 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-9 w-24 bg-gray-200 animate-pulse rounded-button" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const isActive = category === cat.id || (category === null && cat.id === "all");
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`
                  px-4 py-1.5 text-sm border rounded-button whitespace-nowrap
                  flex items-center justify-center transition-colors
                  ${isActive 
                    ? 'bg-brand-red text-white border-brand-red' 
                    : 'border-gray-300 text-gray-700 hover:border-brand-red hover:text-brand-red'
                  }
                `}
              >
                {categoryIcons[cat.id] && (
                  <span className="mr-1.5">
                    {categoryIcons[cat.id]}
                  </span>
                )}
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
