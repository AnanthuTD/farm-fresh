import type { ObjectId } from "mongodb";

export interface Product {
  _id?: ObjectId;
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  weight: number;
  weightUnit: "kg" | "g" | "piece";
  quantity?: number; // Optional for chicken products
  available: boolean;
  sku?: string;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  weight: number;
  weightUnit: "kg" | "g" | "piece";
  customInstructions?: string;
}

export interface Analytics {
  _id?: ObjectId;
  type: "page_visit" | "product_view";
  page?: string;
  productId?: string;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
}

export interface AdminUser {
  _id?: ObjectId;
  username: string;
  password: string; // In production, this should be hashed
  createdAt: Date;
}
