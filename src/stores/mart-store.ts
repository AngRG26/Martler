import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import type { MartSlot } from "@/types/price";
import type { SelectedMart, SelectedMarts } from "@/types/mart";

export type MartState = {
  marts: SelectedMarts;
  hasHydrated: boolean;
};

export type MartActions = {
  setMart: (slot: MartSlot, mart: SelectedMart) => void;
  setHasHydrated: (value: boolean) => void;
};

export type MartStore = MartState & MartActions;

export const defaultMartState: MartState = {
  marts: {
    home: { entpId: "946", name: "이마트천호점" },
    rival: { entpId: "10", name: "이마트부천점" },
  },
  hasHydrated: false,
};

export const createMartStore = (initState: MartState = defaultMartState) =>
  createStore<MartStore>()(
    persist(
      (set) => ({
        ...initState,
        setMart: (slot, mart) =>
          set((state) => ({ marts: { ...state.marts, [slot]: mart } })),
        setHasHydrated: (value) => set({ hasHydrated: value }),
      }),
      {
        name: "martler-marts",
        partialize: (state) => ({ marts: state.marts }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      },
    ),
  );
