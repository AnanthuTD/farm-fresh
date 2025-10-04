"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProductInterest, fetchProducts, qk } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function InterestPage() {
  const { data: interest = [], isLoading } = useQuery({
    queryKey: ["product-interest"],
    queryFn: fetchProductInterest,
    staleTime: 60_000,
  });
  const { data: products = [] } = useQuery({
    queryKey: qk.products({ all: true }),
    queryFn: () => fetchProducts({ all: true }),
    staleTime: 60_000,
  });

  const nameById = new Map(products.map((p) => [p.id, p.name] as const));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User Interest in Unavailable Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Interested Users</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={2}>Loading...</TableCell>
                  </TableRow>
                )}
                {!isLoading && interest.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-muted-foreground">
                      No interest recorded yet
                    </TableCell>
                  </TableRow>
                )}
                {interest.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell className="font-medium">
                      {nameById.get(r._id) || r._id}
                    </TableCell>
                    <TableCell className="text-right">{r.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
