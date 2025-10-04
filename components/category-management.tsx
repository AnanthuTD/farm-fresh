"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCategories as rqFetchCategories, qk } from "@/lib/queries";

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  alwaysAvailable?: boolean;
  availableDays?: number[];
  availableTimeStart?: string;
  availableTimeEnd?: string;
  hideQuantity?: boolean;
}

export default function CategoryManagement() {
  const qc = useQueryClient();
  const { data: categories = [], isLoading: loading } = useQuery({
    queryKey: qk.categories,
    queryFn: () => rqFetchCategories() as Promise<Category[]>,
    staleTime: 60_000,
  });
  const [form, setForm] = useState<Category>({ id: "", name: "", description: "", image: "", alwaysAvailable: true, availableDays: [], availableTimeStart: "", availableTimeEnd: "", hideQuantity: false });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id || !form.name) {
      toast.error("Please provide id and name");
      return;
    }
    try {
      setSubmitting(true);
      const payload: Category = {
        id: form.id.trim(),
        name: form.name.trim(),
        description: form.description?.trim() || undefined,
        image: form.image?.trim() || undefined,
        alwaysAvailable: !!form.alwaysAvailable,
        availableDays: form.availableDays || [],
        availableTimeStart: form.availableTimeStart || undefined,
        availableTimeEnd: form.availableTimeEnd || undefined,
        hideQuantity: !!form.hideQuantity,
      };
      const res = await fetch(editingId ? `/api/categories/${encodeURIComponent(editingId)}` : "/api/categories", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(editingId ? "Category updated" : "Category created");
      setForm({ id: "", name: "", description: "", image: "", alwaysAvailable: true, availableDays: [], availableTimeStart: "", availableTimeEnd: "", hideQuantity: false });
      setEditingId(null);
      await qc.invalidateQueries({ queryKey: qk.categories });
    } catch (e) {
      console.error(e);
      toast.error(editingId ? "Failed to update category" : "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDay = (day: number) => {
    setForm((f) => {
      const set = new Set(f.availableDays || []);
      if (set.has(day)) set.delete(day);
      else set.add(day);
      return { ...f, availableDays: Array.from(set).sort() };
    });
  };

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setForm({
      id: c.id,
      name: c.name,
      description: c.description || "",
      image: c.image || "",
      alwaysAvailable: c.alwaysAvailable ?? true,
      availableDays: c.availableDays || [],
      availableTimeStart: c.availableTimeStart || "",
      availableTimeEnd: c.availableTimeEnd || "",
      hideQuantity: c.hideQuantity ?? false,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Category deleted");
      await qc.invalidateQueries({ queryKey: qk.categories });
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">ID (slug)</label>
              <Input name="id" value={form.id} onChange={handleChange} placeholder="e.g., chicken" disabled={!!editingId} />
            </div>
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="e.g., Chicken" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Short description" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input name="image" value={form.image} onChange={handleChange} placeholder="/category/chicken.png or https://..." />
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Always available</label>
                <div>
                  <input type="checkbox" checked={!!form.alwaysAvailable} onChange={(e) => setForm((f) => ({ ...f, alwaysAvailable: e.target.checked }))} />
                  <span className="ml-2 text-sm">If checked, schedule below is ignored</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hide Quantity Field</label>
                <div>
                  <input type="checkbox" checked={!!form.hideQuantity} onChange={(e) => setForm((f) => ({ ...f, hideQuantity: e.target.checked }))} />
                  <span className="ml-2 text-sm">Hide quantity selection for this category</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, idx) => (
                    <label key={idx} className="flex items-center gap-1 text-sm">
                      <input type="checkbox" checked={(form.availableDays||[]).includes(idx)} onChange={() => toggleDay(idx)} disabled={!!form.alwaysAvailable} />
                      {d}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Available Time</label>
                <div className="flex items-center gap-2">
                  <Input type="time" value={form.availableTimeStart || ""} onChange={(e) => setForm((f) => ({ ...f, availableTimeStart: e.target.value }))} disabled={!!form.alwaysAvailable} />
                  <span>to</span>
                  <Input type="time" value={form.availableTimeEnd || ""} onChange={(e) => setForm((f) => ({ ...f, availableTimeEnd: e.target.value }))} disabled={!!form.alwaysAvailable} />
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : editingId ? "Update Category" : "Save Category"}</Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm({ id: "", name: "", description: "", image: "", alwaysAvailable: true, availableDays: [], availableTimeStart: "", availableTimeEnd: "", hideQuantity: false }); }}>Cancel Edit</Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="w-40">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell className="max-w-sm truncate" title={c.description}>{c.description}</TableCell>
                    <TableCell className="max-w-sm truncate" title={c.image}>{c.image}</TableCell>
                    <TableCell className="text-sm">
                      {c.alwaysAvailable ? (
                        <span className="inline-block px-2 py-1 rounded bg-accent/20 text-foreground">Always</span>
                      ) : (
                        <div className="space-y-1">
                          <div>Days: {(c.availableDays||[]).map((d) => ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d]).join(", ") || "—"}</div>
                          <div>Time: {c.availableTimeStart || "—"} - {c.availableTimeEnd || "—"}</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => startEdit(c)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(c.id)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {categories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">No categories yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
