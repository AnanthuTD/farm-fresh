import { Product } from "./models/Product";
import { Category } from "./models/Category";
import { StoreSettings } from "./models/StoreSettings";

export const qk = {
  products: (params: { all?: boolean; category?: string } = {}) =>
    ["products", params] as const,
  categories: ["categories"] as const,
  storeSettings: ["store-settings"] as const,
};

export async function fetchJSON<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, { cache: "no-store", ...init });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

export interface FetchProductsParams {
  all?: boolean;
  category?: string;
}

export const fetchProducts = ({ all = false, category }: FetchProductsParams = {}) => {
  const searchParams = new URLSearchParams();
  if (all) searchParams.set('all', '1');
  if (category) searchParams.set('category', category);
  
  const queryString = searchParams.toString();
  return fetchJSON<Product[]>(`/api/products${queryString ? `?${queryString}` : ''}`);
};

export const fetchCategories = () => fetchJSON<Category[]>(`/api/categories`);

export const fetchStoreSettings = () =>
  fetchJSON<StoreSettings | null>(`/api/store-settings`);

export type ProductViewsRow = {
  id: string;
  name: string;
  category: string;
  views: number;
};
export const fetchProductViewsDetailed = (params?: {
  category?: string;
  search?: string;
  sort?: "views" | "name";
}) => {
  const sp = new URLSearchParams();
  if (params?.category) sp.set("category", params.category);
  if (params?.search) sp.set("search", params.search);
  if (params?.sort) sp.set("sort", params.sort);
  const qs = sp.toString();
  return fetchJSON<ProductViewsRow[]>(
    `/api/product-views${qs ? `?${qs}` : ""}`
  );
};

export const fetchProductInterest = () =>
  fetchJSON<Array<{ _id: string; count: number }>>(`/api/product-interest`);
export const postProductInterest = (productId: string) =>
  fetchJSON<{ ok: boolean }>(`/api/product-interest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
