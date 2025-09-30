import { Product } from "./models/Product";
import { Category } from "./models/Category";
import { StoreSettings } from "./models/StoreSettings";

export const qk = {
  products: (all = false) => ["products", { all }] as const,
  categories: ["categories"] as const,
  storeSettings: ["store-settings"] as const,
};

export async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: "no-store", ...init });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

export const fetchProducts = (all = false) =>
  fetchJSON<Product[]>(`/api/products${all ? "?all=1" : ""}`);

export const fetchCategories = () => fetchJSON<Category[]>(`/api/categories`);

export const fetchStoreSettings = () =>
  fetchJSON<StoreSettings | null>(`/api/store-settings`);
