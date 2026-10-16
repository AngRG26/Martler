import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";

export type CartState = {
  items: CartItem[];
};

export type CartActions = {
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  changeQuantity: (productId: string, delta: number) => void;
  clear: () => void;
};

export type CartStore = CartState & CartActions;

export const defaultCartState: CartState = { items: [] };

export const createCartStore = (initState: CartState = defaultCartState) =>
  createStore<CartStore>()(
    persist(
      (set) => ({
        ...initState,

        addItem: (item) =>
          set((state) => {
            const exists = state.items.some(
              (i) => i.productId === item.productId,
            ); // true/false
            if (exists) {
              // 이미 담긴 상품이면 수량만 +1
              return {
                items: state.items.map((i) =>
                  i.productId === item.productId
                    ? { ...i, quantity: i.quantity + 1 }
                    : i,
                ),
              };
            }
            return { items: [...state.items, { ...item, quantity: 1 }] };
          }),

        removeItem: (productId) =>
          set((state) => ({
            items: state.items.filter((i) => i.productId !== productId),
          })),

        changeQuantity: (productId, delta) =>
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.max(1, i.quantity + delta) } // 1 밑으로는 안 내려감
                : i,
            ),
          })),

        clear: () => set(defaultCartState),
      }),
      { name: "martler-cart" },
    ),
  );
