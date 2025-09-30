"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQueryState, parseAsString } from "nuqs";
import { useEffect, useState } from "react";

interface CategoryItem { id: string; name: string }

export function ProductFilters() {
  const [category, setCategory] = useQueryState(
    "category",
    parseAsString.withDefault("all")
  );

  const currentCategory = category;

  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: "all", name: "All Products" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const data = (await res.json()) as Array<{ id: string; name: string }>;
        if (active && Array.isArray(data)) {
          setCategories([{ id: "all", name: "All Products" }, ...data]);
        }
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

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      // Remove the query param for default state
      setCategory(null);
    } else {
      setCategory(categoryId);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : (
            categories.map((category) => (
              <Button
                key={category.id}
                variant={currentCategory === category.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Button>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
