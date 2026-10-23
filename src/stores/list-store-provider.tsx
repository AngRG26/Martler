"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createListStore, type ListStore } from "./list-store";

type ListStoreApi = ReturnType<typeof createListStore>;

const ListStoreContext = createContext<ListStoreApi | null>(null);

export function ListStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createListStore());
  return (
    <ListStoreContext.Provider value={store}>
      {children}
    </ListStoreContext.Provider>
  );
}

export function useListStore<T>(selector: (s: ListStore) => T): T {
  const store = useContext(ListStoreContext);
  if (!store)
    throw new Error("useListStore는 ListStoreProvider 안에서 써야 해요");
  return useStore(store, selector);
}
