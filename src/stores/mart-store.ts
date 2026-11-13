import { createStore } from "zustand/vanilla"; // React 밖에서도 쓸 수 있는 store 만들기
import { persist } from "zustand/middleware"; // localStorage 저장 기능
import type { SelectedMart } from "@/types/mart"; // 매장 타입

/** 매장 store의 데이터 */
export type MartState = {
  /** 내 이마트 지점 */
  mart: SelectedMart;
  /** localStorage에서 다 불러왔는지 */
  hasHydrated: boolean;
};

/** 매장 store의 함수들 */
export type MartActions = {
  /** 내 매장 바꾸기 (6단계 매장 설정 화면에서 써요) */
  setMart: (mart: SelectedMart) => void;
  /** 불러오기 완료 표시 */
  setHasHydrated: (value: boolean) => void;
};

/** 매장 store 전체 (데이터 + 함수) */
export type MartStore = MartState & MartActions;

/** 처음 상태: 이마트천호점 */
export const defaultMartState: MartState = {
  mart: { entpId: "946", name: "이마트천호점" }, // 기본 매장
  hasHydrated: false, // 아직 안 불러옴
};

/** 0번 형식(지점 비교 시절)의 저장 모양 */
type MartStateV0 = {
  /** 내 매장(home)과 비교 지점(rival) */
  marts: { home: SelectedMart; rival: SelectedMart };
};

/** 매장 store를 만드는 함수 (Provider가 한 번 불러요) */
export const createMartStore = (initState: MartState = defaultMartState) =>
  createStore<MartStore>()(
    persist(
      (set) => ({
        ...initState, // 처음 상태 펼치기
        setMart: (mart) => set({ mart }), // 매장 하나를 통째로 바꿔요
        setHasHydrated: (value) => set({ hasHydrated: value }), // 불러오기 완료 표시
      }),
      {
        name: "martler-marts", // localStorage 키 이름 (그대로 써요)
        partialize: (state) => ({ mart: state.mart }), // mart만 저장
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true); // 불러오기가 끝나면 표시
        },

        // 저장 형식 번호: marts(두 개) → mart(하나)로 바뀌어서 1로 올려요
        version: 1,
        // 예전 형식이면 새 모양으로 옮겨요
        migrate: (persistedState, version) => {
          // 0번 형식: marts.home을 꺼내서 mart로 (비교 지점 rival은 버려요)
          if (version === 0) {
            const old = persistedState as MartStateV0; // 예전 모양이라고 알려주고
            return { mart: old.marts.home }; // 내 매장만 살려요
          }
          // 그 밖의 경우는 그대로
          return persistedState as { mart: SelectedMart };
        },
      },
    ),
  );
