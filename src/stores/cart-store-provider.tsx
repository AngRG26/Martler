"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createCartStore, type CartStore } from "./cart-store";

type CartStoreApi = ReturnType<typeof createCartStore>;

const CartStoreContext = createContext<CartStoreApi | null>(null);

export function CartStoreProvider({ children }: { children: ReactNode }) {
  // 컴포넌트가 처음 그려질 때 딱 한 번만 store를 만듦
  const [store] = useState(() => createCartStore());

  return (
    <CartStoreContext.Provider value={store}>
      {children}
    </CartStoreContext.Provider>
  );
}

export function useCartStore<T>(selector: (state: CartStore) => T): T {
  const store = useContext(CartStoreContext);
  if (!store) {
    throw new Error("useCartStore는 CartStoreProvider 안에서만 쓸 수 있어요");
  }
  return useStore(store, selector);
}
