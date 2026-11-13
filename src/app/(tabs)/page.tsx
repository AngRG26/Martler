"use client"; // store와 hook을 쓰니까 클라이언트 컴포넌트

import { useCartStore } from "@/stores/cart-store-provider"; // 장바구니 아이템, 복원 여부
import { useMartName, useMartStore } from "@/stores/mart-store-provider"; // 내 매장 이름, 매장 store
import { usePriceSnapshot } from "@/hooks/use-price-snapshot"; // 서버에서 가격 받아오기
import { calcCartChange } from "@/lib/price-change"; // 장바구니 전체 변동 계산
import { formatSurveyDate } from "@/lib/price"; // "11월 6일" 만들기
import type { ProductPrice } from "@/types/snapshot"; // 상품 가격 타입
import { CartHeader } from "@/components/cart-header"; // 위쪽 헤더
import { FavoriteChips } from "@/components/favorite-chips"; // 즐겨찾기 칩
import { CartItemCard } from "@/components/cart-item-card"; // 상품 카드
import { CartSummaryBar } from "@/components/cart-summary-bar"; // 아래 고정 바
import { mockFavorites } from "@/mocks/favorites"; // 즐겨찾기 목업

/** 장바구니 화면 ('/') */
export default function Home() {
  // 장바구니에 담긴 상품들
  const items = useCartStore((s) => s.items);
  // localStorage에서 장바구니를 다 불러왔는지
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  // 내 매장 ID (예: '946'). 이걸로 서버에 가격을 요청해요
  const martId = useMartStore((s) => s.mart.entpId); // 내 매장 ID (예: '946')
  // 내 매장 짧은 이름 (예: '천호점')
  const martName = useMartName(); // 내 매장 짧은 이름 (예: '천호점')

  // 서버에서 가격 받아오기 → { status: 'loading' | 'error' | 'success', ... }
  const priceState = usePriceSnapshot(martId);
  // 성공했을 때만 가격 묶음을 꺼내고, 아니면 null
  const snapshot = priceState.status === "success" ? priceState.snapshot : null;
  // 가격이 있을 때만 장바구니 전체 변동 계산
  const change = snapshot ? calcCartChange(items, snapshot.products) : null;

  return (
    <div>
      {/* 헤더: 복원 전에는 상품 수를 숨겨요 (0개로 깜빡이지 않게) */}
      <CartHeader itemCount={hasHydrated ? items.length : null} />
      {/* 즐겨찾기 칩: 누르면 장바구니에 담겨요 */}
      <FavoriteChips favorites={mockFavorites} />

      {/* 본문 영역: 좌우 여백 */}
      <div className="px-4 pt-2">
        {!hasHydrated ? (
          // ① 장바구니 복원 중 → 카드 모양 스켈레톤
          <div className="flex flex-col gap-2.5 pt-6">
            <div className="h-[120px] animate-pulse rounded-[14px] bg-white" />
            <div className="h-[120px] animate-pulse rounded-[14px] bg-white" />
          </div>
        ) : items.length === 0 ? (
          // ② 장바구니가 비어 있음 → 안내 문구
          <div className="flex flex-col items-center gap-1 py-16 text-center">
            <p className="text-[15px] font-semibold text-ink">
              장바구니가 비어 있어요
            </p>
            <p className="text-[13px] text-muted">
              상품을 검색하거나 즐겨찾기에서 담아보세요
            </p>
          </div>
        ) : (
          // ③ 상품이 있음 → 조사일 문구 + 카드 목록 + 하단 바
          <>
            {/* 조사일 문구: 상태에 따라 세 가지 */}
            <p className="mb-2 px-1 text-xs text-muted">
              {priceState.status === "loading" && "가격을 불러오는 중이에요"}
              {priceState.status === "error" && priceState.message}
              {snapshot && (
                <>
                  {/* 이번 조사일을 굵게 */}
                  가격은{" "}
                  <strong className="font-semibold text-ink">
                    {formatSurveyDate(snapshot.surveyedAt)} 조사 기준
                  </strong>
                  이에요.
                  <br />
                  출처: 한국소비자원 참가격
                </>
              )}
            </p>

            {/* 카드 목록. 아래 고정 바에 가리지 않게 아래 여백 (pb-40) */}
            <ul className="flex flex-col gap-2.5 pb-40">
              {items.map((item) => (
                <CartItemCard
                  key={item.productId} // 목록에서 각 카드를 구분하는 값
                  item={item} // 장바구니 아이템
                  // 이 상품의 가격 (Record의 함정 때문에 없을 수 있다고 직접 적어요)
                  product={
                    snapshot?.products[item.productId] as
                      | ProductPrice
                      | undefined
                  }
                  isPriceLoading={priceState.status === "loading"} // 로딩 중이면 카드에 스켈레톤
                  martName={martName} // 매장 이름
                  previousSurveyedAt={snapshot?.previousSurveyedAt ?? null} // 지난 조사일
                />
              ))}
            </ul>

            {/* 하단 바: 가격을 받은 뒤에만 */}
            {snapshot && change && (
              <CartSummaryBar
                change={change} // 전체 변동
                martName={martName} // 매장 이름
                surveyedAt={snapshot.surveyedAt} // 이번 조사일
                previousSurveyedAt={snapshot.previousSurveyedAt} // 지난 조사일
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
