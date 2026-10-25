"use client";

import { useCartStore } from "@/stores/cart-store-provider";
import { CartHeader } from "@/components/cart-header";
import { CartItemCard } from "@/components/cart-item-card";
import { mockPriceSnapshot } from "@/mocks/prices";
import { CartSummaryBar } from "@/components/cart-summary-bar";
import { compareCart, formatSurveyDate } from "@/lib/price";
import { FavoriteChips } from "@/components/favorite-chips";
import { mockFavorites } from "@/mocks/favorites";

export default function Home() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const comparison = compareCart(items, mockPriceSnapshot.products);

  return (
    <div className="min-h-dvh bg-canvas">
      <CartHeader itemCount={hasHydrated ? items.length : null} />
      <FavoriteChips favorites={mockFavorites} />

      <div className="px-4 pt-2">
        {!hasHydrated ? (
          <div className="flex flex-col gap-2.5 pt-6">
            <div className="h-[120px] animate-pulse rounded-[14px] bg-white" />
            <div className="h-[120px] animate-pulse rounded-[14px] bg-white" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-16 text-center">
            <p className="text-[15px] font-semibold text-ink">
              장바구니가 비어 있어요.
            </p>
            <p className="text-[13px] text-muted">
              상품을 검색하거나 즐겨찾기에서 담아보세요.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-2 px-1 text-xs text-muted">
              가격은{" "}
              <strong className="font-semibold text-ink">
                {formatSurveyDate(mockPriceSnapshot.surveyedAt)} 조사 기준
              </strong>
              이에요.
              <br />
              출처: 한국소비자원 참가격
            </p>
            <ul className="flex flex-col gap-2.5 pb-48">
              {items.map((item) => (
                <CartItemCard
                  key={item.productId}
                  item={item}
                  product={mockPriceSnapshot.products[item.productId]}
                />
              ))}
            </ul>
            <CartSummaryBar
              comparison={comparison}
              surveyedAt={mockPriceSnapshot.surveyedAt}
            />
          </>
        )}
      </div>
    </div>
  );
}
