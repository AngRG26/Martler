"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createMartStore, type MartStore } from "./mart-store";
import { shortMartName } from "@/lib/mart";
import type { MartSlot } from "@/types/price";

type MartStoreApi = ReturnType<typeof createMartStore>;

const MartStoreContext = createContext<MartStoreApi | null>(null);

export function MartStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createMartStore());
  return (
    <MartStoreContext.Provider value={store}>
      {children}
    </MartStoreContext.Provider>
  );
}

export function useMartStore<T>(selector: (s: MartStore) => T): T {
  const store = useContext(MartStoreContext);
  if (!store)
    throw new Error("useMartStore는 MartStoreProvider 안에서 써야 해요");
  return useStore(store, selector);
}

// 화면에 보여줄 짧은 이름: { home: '천호점', rival: '부천점' }
export function useMartLabels(): Record<MartSlot, string> {
  const marts = useMartStore((s) => s.marts);
  return {
    home: shortMartName(marts.home.name),
    rival: shortMartName(marts.rival.name),
  };
}
