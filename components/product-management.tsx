"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import type { Product } from "@/lib/models/Product";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCategories as rqFetchCategories, fetchProducts as rqFetchProducts, qk } from "@/lib/queries";

interface CategoryItem { id: string; name: string }

export default function ProductManagement() {
  const qc = useQueryClient();
  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: qk.products(true),
    queryFn: () => rqFetchProducts(true) as Promise<Product[]>,
    staleTime: 30_000,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "" as string,
    price: 0,
    image: "",
    description: "",
    cutTypes: "",
    skinOptions: "",
    available: true,
  });
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: qk.categories,
    queryFn: () => rqFetchCategories() as Promise<CategoryItem[]>,
    staleTime: 60_000,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      ...formData,
      cutTypes: formData.cutTypes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      skinOptions: formData.skinOptions
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        await qc.invalidateQueries({ queryKey: qk.products(true) });
        resetForm();
        setIsAddDialogOpen(false);
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.description,
      cutTypes: product.cutTypes.join(", "),
      skinOptions: product.skinOptions?.join(", ") || "",
      available: product.available,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (res.ok) await qc.invalidateQueries({ queryKey: qk.products(true) });
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      category: categories[0]?.id || "",
      price: 0,
      image: "",
      description: "",
      cutTypes: "",
      skinOptions: "",
      available: true,
    });
    setEditingProduct(null);
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-gray-600">Manage your meat shop products</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Update product information"
                  : "Add a new product to your inventory"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Product ID</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) =>
                      setFormData({ ...formData, id: e.target.value })
                    }
                    required
                    disabled={!!editingProduct}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select a category"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cutTypes">Cut Types (comma separated)</Label>
                  <Input
                    id="cutTypes"
                    value={formData.cutTypes}
                    onChange={(e) =>
                      setFormData({ ...formData, cutTypes: e.target.value })
                    }
                    placeholder="Whole, Pieces, Boneless"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skinOptions">
                    Skin Options (comma separated)
                  </Label>
                  <Input
                    id="skinOptions"
                    value={formData.skinOptions}
                    onChange={(e) =>
                      setFormData({ ...formData, skinOptions: e.target.value })
                    }
                    placeholder="Skin On, Skin Off"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingProduct ? "Update" : "Add"} Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products ({products.length})</CardTitle>
          <CardDescription>Manage your product inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative w-12 h-12">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover rounded"
                        sizes="48px"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={product.available ? "default" : "destructive"}>
                        {product.available ? "Available" : "Unavailable"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/products/${product.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ available: !product.available }),
                            });
                            if (res.ok) {
                              await qc.invalidateQueries({ queryKey: qk.products(true) });
                            }
                          } catch (e) {
                            console.error("Failed to toggle availability", e);
                          }
                        }}
                      >
                        {product.available ? "Set Unavailable" : "Set Available"}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
