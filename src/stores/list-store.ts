import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import type { ShoppingList } from "@/types/list";

export type ListState = {
  lists: ShoppingList[];
  hasHydrated: boolean;
};

export type ListActions = {
  addList: (list: ShoppingList) => void;
  removeList: (id: string) => void;
  setHasHydrated: (value: boolean) => void;
};

export type ListStore = ListState & ListActions;

export const defaultListState: ListState = { lists: [], hasHydrated: false };

export const createListStore = (initState: ListState = defaultListState) =>
  createStore<ListStore>()(
    persist(
      (set) => ({
        ...initState,
        // 새 리스트를 맨 앞에 (최신순)
        addList: (list) => set((state) => ({ lists: [list, ...state.lists] })),
        removeList: (id) =>
          set((state) => ({ lists: state.lists.filter((l) => l.id !== id) })),
        setHasHydrated: (value) => set({ hasHydrated: value }),
      }),
      {
        name: "martler-lists",
        partialize: (state) => ({ lists: state.lists }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      },
    ),
  );
