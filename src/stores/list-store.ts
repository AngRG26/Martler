import { createStore } from "zustand/vanilla"; // React 밖에서도 쓸 수 있는 store 만들기
import { persist } from "zustand/middleware"; // localStorage 저장 기능
import type { ShoppingList } from "@/types/list"; // 리스트 타입

/** 리스트 store의 데이터 */
export type ListState = {
  /** 확정한 리스트들 (최신순) */
  lists: ShoppingList[];
  /** localStorage에서 다 불러왔는지 */
  hasHydrated: boolean;
};

/** 리스트 store의 함수들 */
export type ListActions = {
  /** 새 리스트를 맨 앞에 추가 */
  addList: (list: ShoppingList) => void;
  /** ID로 리스트 삭제 */
  removeList: (id: string) => void;
  /** 불러오기 완료 표시 */
  setHasHydrated: (value: boolean) => void;
};

/** 리스트 store 전체 (데이터 + 함수) */
export type ListStore = ListState & ListActions;

/** 처음 상태 (아무것도 없음) */
export const defaultListState: ListState = { lists: [], hasHydrated: false };

/** 리스트 store를 만드는 함수 (Provider가 한 번 불러요) */
export const createListStore = (initState: ListState = defaultListState) =>
  createStore<ListStore>()(
    persist(
      (set) => ({
        ...initState, // 처음 상태 펼치기
        // 새 리스트를 맨 앞에 (최신순)
        addList: (list) => set((state) => ({ lists: [list, ...state.lists] })),
        // 그 ID만 빼고 새 배열
        removeList: (id) =>
          set((state) => ({ lists: state.lists.filter((l) => l.id !== id) })),
        // 불러오기 완료 표시
        setHasHydrated: (value) => set({ hasHydrated: value }),
      }),
      {
        name: "martler-lists", // localStorage 키 이름
        partialize: (state) => ({ lists: state.lists }), // lists만 저장 (hasHydrated는 저장 안 함)
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true); // 불러오기가 끝나면 표시
        },

        // 저장 형식 번호. 처음엔 0이었고, priceSummary 모양이 바뀌어서 1로 올려요
        version: 1,
        // 저장된 번호가 지금(1)보다 낮으면, 불러올 때 이 함수로 새 모양으로 바꿔요
        migrate: (persistedState, version) => {
          // 저장된 데이터는 모양을 확신할 수 없어서 unknown으로 와요. lists 배열이 있다고 보고 꺼내요
          const state = persistedState as { lists: ShoppingList[] };

          // 0번(지점 비교 시절) 데이터: priceSummary를 새 모양으로 바꿀 정보가 없어요
          // (지난 조사 가격이 없었으니까) → 기록만 비우고 상품 목록은 살려요
          if (version === 0) {
            return {
              lists: state.lists.map((list) => ({
                ...list,
                priceSummary: null,
              })),
            };
          }

          // 그 밖의 경우는 그대로
          return state;
        },
      },
    ),
  );
