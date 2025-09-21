"use client";

import type React from "react";
import { createContext, useContext, useReducer, type ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  cutType?: string;
  category: "chicken" | "fish" | "beef";
  image: string;
  skinless?: boolean; // For chicken products
  customInstructions?: string;
  weight?: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: Omit<CartItem, "quantity"> & { quantity?: number };
    }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

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
        return {
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
        };
      }

      const newItem = {
        ...action.payload,
        quantity: action.payload.quantity || 1,
      };
      const updatedItems = [...state.items, newItem];
      return {
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      return {
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0);

      return {
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      };
    }

    case "CLEAR_CART":
      return { items: [], total: 0 };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

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

export const products = [
  {
    id: "chicken-whole",
    name: "Whole Chicken",
    category: "chicken" as const,
    price: 280,
    image: "/whole-chicken-fresh.jpg",
    cutTypes: ["Whole", "Cut into pieces", "Boneless", "Curry cut"],
    description: "Fresh farm chicken, perfect for roasting or cutting",
    hasSkinOption: true,
    weightUnit: "kg",
  },
  {
    id: "chicken-breast",
    name: "Chicken Breast",
    category: "chicken" as const,
    price: 320,
    image: "/chicken-breast-boneless.jpg",
    cutTypes: ["Boneless", "With bone", "Fillet"],
    description: "Tender chicken breast, ideal for grilling",
    hasSkinOption: true,
    weightUnit: "kg",
  },
  {
    id: "chicken-legs",
    name: "Chicken Drumsticks",
    category: "chicken" as const,
    price: 240,
    image: "/chicken-drumsticks-fresh.jpg",
    cutTypes: ["Whole legs", "Drumsticks only", "Thighs"],
    description: "Juicy chicken drumsticks, great for BBQ",
    hasSkinOption: true,
    weightUnit: "kg",
  },
  {
    id: "fish-pomfret",
    name: "Pomfret Fish",
    category: "fish" as const,
    price: 450,
    image: "/pomfret-fish-fresh.jpg",
    cutTypes: ["Whole", "Cleaned", "Filleted", "Curry cut"],
    description: "Fresh pomfret, excellent for frying or curry",
    hasSkinOption: false,
    weightUnit: "kg",
  },
  {
    id: "fish-salmon",
    name: "Salmon Fillet",
    category: "fish" as const,
    price: 800,
    image: "/salmon-fillet-fresh.jpg",
    cutTypes: ["Fillet", "Steaks", "Whole"],
    description: "Premium salmon fillet, rich in omega-3",
    hasSkinOption: false,
    weightUnit: "kg",
  },
  {
    id: "fish-prawns",
    name: "Fresh Prawns",
    category: "fish" as const,
    price: 600,
    image: "/fresh-prawns-cleaned.jpg",
    cutTypes: ["With shell", "Peeled", "Deveined", "Butterfly cut"],
    description: "Fresh prawns, perfect for curries and stir-fry",
    hasSkinOption: false,
    weightUnit: "kg",
  },
  {
    id: "beef-steak",
    name: "Beef Steak",
    category: "beef" as const,
    price: 650,
    image: "/beef-steak-premium.jpg",
    cutTypes: ["Ribeye", "Sirloin", "Tenderloin", "T-bone"],
    description: "Premium beef steak, perfectly marbled",
    hasSkinOption: false,
    weightUnit: "kg",
  },
  {
    id: "beef-mince",
    name: "Beef Mince",
    category: "beef" as const,
    price: 380,
    image: "/beef-mince-fresh.jpg",
    cutTypes: ["Regular", "Lean", "Extra lean", "Coarse ground"],
    description: "Fresh ground beef, ideal for burgers and kebabs",
    hasSkinOption: false,
    weightUnit: "kg",
  },
  {
    id: "beef-ribs",
    name: "Beef Ribs",
    category: "beef" as const,
    price: 520,
    image: "/beef-ribs-bone-in.jpg",
    cutTypes: ["Bone-in", "Boneless", "Short ribs", "Back ribs"],
    description: "Tender beef ribs, perfect for slow cooking",
    hasSkinOption: false,
    weightUnit: "kg",
  },
];

export const STORE_WHATSAPP_NUMBER = "919544845854"; // Farm Fresh WhatsApp number

export function generateWhatsAppMessage(
  items: CartItem[],
  customerAddress?: string
): string {
  let message = "🛒 *Order Details:*\n\n";

  items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   • Cut: ${item.cutType || "Standard"}\n`;
    if (item.skinless !== undefined) {
      message += `   • Skin: ${item.skinless ? "Skinless" : "With skin"}\n`;
    }
    message += `   • Quantity: ${item.quantity} ${
      item.weight ? `(${item.weight}kg)` : "piece(s)"
    }\n`;
    message += `   • Price: ₹${item.price} each\n`;
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
