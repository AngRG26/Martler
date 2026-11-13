"use client"; // Context와 hook을 쓰니까 클라이언트 컴포넌트

import { createContext, useContext, useState, type ReactNode } from "react"; // React 기본 도구
import { useStore } from "zustand"; // store를 React에서 읽는 hook
import { createMartStore, type MartStore } from "./mart-store"; // 매장 store
import { shortMartName } from "@/lib/mart"; // '이마트천호점' → '천호점'

/** createMartStore가 만드는 store의 타입 */
type MartStoreApi = ReturnType<typeof createMartStore>;

/** 매장 store를 아래 컴포넌트들에게 전달하는 통로 */
const MartStoreContext = createContext<MartStoreApi | null>(null);

/** 매장 store를 만들어서 아래로 전달해요 (루트 layout에서 감싸요) */
export function MartStoreProvider({ children }: { children: ReactNode }) {
  // 처음 한 번만 store를 만들고 계속 같은 걸 써요
  const [store] = useState(() => createMartStore());
  // children 전체가 이 store를 쓸 수 있게
  return (
    <MartStoreContext.Provider value={store}>
      {children}
    </MartStoreContext.Provider>
  );
}

/**
 * 매장 store에서 필요한 값만 꺼내요.
 * @param selector store에서 무엇을 꺼낼지 (예: (s) => s.mart.entpId)
 */
export function useMartStore<T>(selector: (s: MartStore) => T): T {
  const store = useContext(MartStoreContext); // 위에서 전달된 store
  if (!store)
    throw new Error("useMartStore는 MartStoreProvider 안에서 써야 해요"); // Provider 밖이면 에러
  return useStore(store, selector); // 고른 값이 바뀔 때만 다시 그려요
}

/**
 * 화면에 보여줄 내 매장 짧은 이름 (예: '천호점').
 * 문자열 하나를 돌려주니까 selector 안에서 바로 가공해도 안전해요.
 */
export function useMartName(): string {
  return useMartStore((s) => shortMartName(s.mart.name)); // 같은 이름이면 같은 문자열이라 다시 안 그려요
}
