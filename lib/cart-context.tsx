"use client";

import type React from "react";
import { createContext, useContext, useReducer, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchProducts } from "./queries";

export type Category = 'chicken' | 'fish' | 'beef' | 'mutton' | 'seafood' | 'combo' | 'other';

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  category: Category;
  image: string;
  customInstructions?: string;
  weight: number;
  weightUnit: 'kg' | 'g' | 'piece';
}

interface CartState {
  items: CartItem[];
  total: number;
  products: any[]; // Products fetched from backend
  loading: boolean;
}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: Omit<CartItem, "quantity"> & { quantity?: number };
    }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_PRODUCTS"; payload: any[] }
  | { type: "SET_LOADING"; payload: boolean };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: item.quantity + (action.payload.quantity || 1),
              }
            : item
        );
        const newState = {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
        };
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(newState));
        }
        return newState;
      }

      const newItem = {
        ...action.payload,
        quantity: action.payload.quantity || 1,
      };
      const updatedItems = [...state.items, newItem];
      const newState = {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(newState));
      }
      return newState;
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      const newState = {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(newState));
      }
      return newState;
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0);

      const newState = {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(newState));
      }
      return newState;
    }

    case "CLEAR_CART":
      const clearedState = { ...state, items: [], total: 0 };
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(clearedState));
      }
      return clearedState;

    case "SET_PRODUCTS":
      return { ...state, products: action.payload };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Load cart from localStorage on initialization
  const getInitialState = (): CartState => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          return JSON.parse(savedCart);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    return {
      items: [],
      total: 0,
      products: [],
      loading: false
    };
  };

  const [state, dispatch] = useReducer(cartReducer, getInitialState());

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Hook to fetch products and update cart context
export function useCartProducts() {
  const { dispatch } = useCart();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["cart-products"],
    queryFn: () => fetchProducts({ all: true }),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (products.length > 0) {
      dispatch({ type: "SET_PRODUCTS", payload: products });
    }
    dispatch({ type: "SET_LOADING", payload: isLoading });
  }, [products, isLoading, dispatch]);

  return { products, isLoading };
}

// Function to fetch products from backend
export async function fetchCartProducts() {
  try {
    const products = await fetchProducts({ all: true });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export const STORE_WHATSAPP_NUMBER = "919544845854"; // Farm Fresh WhatsApp number

export function generateWhatsAppMessage(
  items: CartItem[],
  customerAddress?: string
): string {
  let message = "🛒 *Order Details:*\n\n";

  items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   • Weight: ${item.weight} ${
      item.weightUnit === "g" ? "g" : "kg"
    }\n`;
    message += `   • Quantity: ${item.quantity} ${
      item.weightUnit === "piece" ? "piece(s)" : ""
    }\n`;
    message += `   • Price: ₹${item.price} ${
      item.weightUnit === "piece" ? "each" : `per ${item.weightUnit}`
    }\n`;
    if (item.customInstructions) {
      message += `   • Special instructions: ${item.customInstructions}\n`;
    }
    message += `   • Subtotal: ₹${item.price * item.quantity}\n\n`;
  });

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  message += `💰 *Total Amount: ₹${total}*\n\n`;

  if (customerAddress) {
    message += `📍 *Delivery Address:*\n${customerAddress}\n\n`;
  }

  message +=
    "Please confirm this order and let me know the delivery time. Thank you! 🙏";

  return encodeURIComponent(message);
}

export function generateWhatsAppUrl(
  items: CartItem[],
  customerAddress?: string
): string {
  const message = generateWhatsAppMessage(items, customerAddress);
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${message}`;
}
