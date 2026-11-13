import { useEffect, useState } from "react";
import type { MartPriceSnapshot } from "@/types/snapshot";

// 화면이 알아야 할 세 가지 상태
// status 값에 따라 들어 있는 필드가 달라요 (아래 "구별되는 유니온" 참고)
export type PriceSnapshotState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; snapshot: MartPriceSnapshot };

// 응답이 "어느 매장 것인지"까지 같이 저장해요
type Loaded = { martId: string; state: PriceSnapshotState };

export function usePriceSnapshot(martId: string): PriceSnapshotState {
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    // 응답이 오기 전에 매장이 바뀌거나 화면을 떠나면,
    // 늦게 도착한 예전 응답을 무시하려고 쓰는 표시예요
    let ignore = false;

    fetch(`/api/prices?mart=${martId}`)
      .then(async (res) => {
        // 400, 404 같은 응답은 fetch가 에러로 보지 않아서 직접 확인해요
        if (!res.ok) {
          const body = await res.json().catch(() => null); // 본문이 JSON이 아니어도 죽지 않게
          throw new Error(
            body?.error ?? `가격을 불러오지 못했어요 (${res.status})`,
          );
        }
        return (await res.json()) as MartPriceSnapshot;
      })
      .then((snapshot) => {
        if (!ignore)
          setLoaded({ martId, state: { status: "success", snapshot } });
      })
      .catch((error: Error) => {
        if (!ignore)
          setLoaded({
            martId,
            state: { status: "error", message: error.message },
          });
      });

    // 정리 함수: martId가 바뀌거나 화면을 떠날 때 React가 불러줘요
    return () => {
      ignore = true;
    };
  }, [martId]); // martId가 바뀔 때마다 다시 받아요

  // 아직 아무것도 안 왔거나, 와 있는 게 "다른 매장" 것이면 로딩 중
  // (매장을 바꾼 직후에 예전 매장 가격이 잠깐 보이는 걸 막아요)
  if (!loaded || loaded.martId !== martId) return { status: "loading" };

  return loaded.state;
}
