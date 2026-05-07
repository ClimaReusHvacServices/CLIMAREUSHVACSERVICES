"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  hydrated: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; item: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QTY"; productId: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "HYDRATE"; items: CartItem[] };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items, hydrated: true };
    case "ADD_ITEM": {
      const existing = state.items.find(i => i.productId === action.item.productId);
      const items = existing
        ? state.items.map(i =>
            i.productId === action.item.productId ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...state.items, { ...action.item, quantity: 1 }];
      return { ...state, items, isOpen: true };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter(i => i.productId !== action.productId) };
    case "UPDATE_QTY": {
      if (action.quantity <= 0)
        return { ...state, items: state.items.filter(i => i.productId !== action.productId) };
      return {
        ...state,
        items: state.items.map(i =>
          i.productId === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      };
    }
    case "CLEAR":
      return { ...state, items: [] };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

const CART_KEY = "clima_cart_v1";

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  hydrated: boolean;
  totalItems: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isOpen: false, hydrated: false });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      dispatch({ type: "HYDRATE", items: saved ? JSON.parse(saved) : [] });
    } catch {
      dispatch({ type: "HYDRATE", items: [] });
    }
  }, []);

  useEffect(() => {
    if (state.hydrated) {
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    }
  }, [state.items, state.hydrated]);

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const taxAmount = Math.round(subtotal * 21) / 100;
  const total = subtotal + taxAmount;

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        hydrated: state.hydrated,
        totalItems,
        subtotal,
        taxAmount,
        total,
        addItem: (item) => dispatch({ type: "ADD_ITEM", item }),
        removeItem: (productId) => dispatch({ type: "REMOVE_ITEM", productId }),
        updateQty: (productId, quantity) => dispatch({ type: "UPDATE_QTY", productId, quantity }),
        clearCart: () => dispatch({ type: "CLEAR" }),
        openCart: () => dispatch({ type: "OPEN" }),
        closeCart: () => dispatch({ type: "CLOSE" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
