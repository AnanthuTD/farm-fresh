"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQueryState, parseAsString } from "nuqs";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, qk } from "@/lib/queries";

interface CategoryItem { id: string; name: string }

export function ProductFilters() {
  const [category, setCategory] = useQueryState(
    "category",
    parseAsString.withDefault("all")
  );

  const currentCategory = category;

  const { data: cats = [], isLoading: loading } = useQuery({
    queryKey: qk.categories,
    queryFn: () => fetchCategories() as Promise<CategoryItem[]>,
    staleTime: 60_000,
  });
  const categories = useMemo(() => [{ id: "all", name: "All Products" }, ...cats], [cats]);

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
