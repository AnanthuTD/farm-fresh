"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchStoreSettings, qk } from "@/lib/queries";

interface StoreSettings {
  weekdayOpen: string;
  weekdayClose: string;
  sundayOpen?: string;
  sundayClose?: string;
  whatsappNumber?: string;
  offDates: string[]; // YYYY-MM-DD
}

export default function AdminStoreSettings() {
  const qc = useQueryClient();
  const { data, isLoading: loading } = useQuery({
    queryKey: qk.storeSettings,
    queryFn: fetchStoreSettings,
    staleTime: 60_000,
  });
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<StoreSettings>({
    weekdayOpen: "07:00",
    weekdayClose: "19:00",
    sundayOpen: "07:00",
    sundayClose: "12:00",
    whatsappNumber: "919544845854",
    offDates: [],
  });

  const [newOffDate, setNewOffDate] = useState<string>("");
  const [rangeStart, setRangeStart] = useState<string>("");
  const [rangeEnd, setRangeEnd] = useState<string>("");

  useEffect(() => {
    if (data) {
      setForm({
        weekdayOpen: data.weekdayOpen || "07:00",
        weekdayClose: data.weekdayClose || "19:00",
        sundayOpen: data.sundayOpen || "07:00",
        sundayClose: data.sundayClose || "12:00",
        whatsappNumber: data.whatsappNumber || "919544845854",
        offDates: Array.isArray(data.offDates) ? data.offDates : [],
      });
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (payload: StoreSettings) => {
      const res = await fetch("/api/store-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("save failed");
      return res.json();
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.storeSettings });
      toast.success("Settings saved");
    },
    onError: () => toast.error("Failed to save settings"),
  });

  const save = async () => {
    try {
      setSaving(true);
      await saveMutation.mutateAsync(form);
    } finally {
      setSaving(false);
    }
  };

  const addOffDate = () => {
    if (!newOffDate) return;
    setForm((f) => {
      const set = new Set(f.offDates);
      set.add(newOffDate);
      return { ...f, offDates: Array.from(set).sort() };
    });
    setNewOffDate("");
  };

  const addOffRange = () => {
    if (!rangeStart || !rangeEnd) return;
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return;
    const dates: string[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, '0');
      const d = String(cur.getDate()).padStart(2, '0');
      dates.push(`${y}-${m}-${d}`);
      cur.setDate(cur.getDate() + 1);
    }
    setForm((f) => {
      const set = new Set(f.offDates);
      dates.forEach((day) => set.add(day));
      return { ...f, offDates: Array.from(set).sort() };
    });
    setRangeStart("");
    setRangeEnd("");
  };

  const removeOffDate = (d: string) => {
    setForm((f) => ({ ...f, offDates: f.offDates.filter((x) => x !== d) }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Store Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Weekday Open</label>
                <Input type="time" value={form.weekdayOpen} onChange={(e) => setForm({ ...form, weekdayOpen: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Weekday Close</label>
                <Input type="time" value={form.weekdayClose} onChange={(e) => setForm({ ...form, weekdayClose: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sunday Open</label>
                <Input type="time" value={form.sundayOpen} onChange={(e) => setForm({ ...form, sundayOpen: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sunday Close</label>
                <Input type="time" value={form.sundayClose} onChange={(e) => setForm({ ...form, sundayClose: e.target.value })} />
              </div>
            </div>
          )}
          <div>
            <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp Number</label>
                <Input
                  type="tel"
                  placeholder="919544845854"
                  value={form.whatsappNumber}
                  onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Include country code, no spaces or special characters (e.g., 919544845854)
                </p>
              </div>
            </div>
          )}
          <div>
            <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Off Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Add off date</label>
              <Input type="date" value={newOffDate} onChange={(e) => setNewOffDate(e.target.value)} />
            </div>
            <Button onClick={addOffDate} disabled={!newOffDate}>Add</Button>
          </div>

          <div className="flex flex-wrap gap-2 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Off range start</label>
              <Input type="date" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Off range end</label>
              <Input type="date" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} />
            </div>
            <Button onClick={addOffRange} disabled={!rangeStart || !rangeEnd}>Add Range</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.offDates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-muted-foreground">No off dates</TableCell>
                </TableRow>
              )}
              {form.offDates.map((d) => (
                <TableRow key={d}>
                  <TableCell>{d}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => removeOffDate(d)}>Remove</Button>
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
