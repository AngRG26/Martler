"use client";

import { useCartStore } from "@/stores/cart-store-provider";
import { CartHeader } from "@/components/cart-header";
import { CartItemCard } from "@/components/cart-item-card";
import { mockPriceSnapshot } from "@/mocks/prices";

export default function Home() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const addItem = useCartStore((s) => s.addItem);
  // changeQuantity, removeItem은 카드가 직접 쓰니까 삭제

  return (
    <div className="min-h-dvh bg-canvas">
      <CartHeader itemCount={hasHydrated ? items.length : null} />

      <div className="space-y-4 p-4">
        {/* 임시 테스트 버튼 (3단계 이후 삭제) */}
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-lg bg-brand px-4 py-2 text-white"
            onClick={() =>
              addItem({ productId: "milk-1l", name: "서울우유 1L" })
            }
          >
            우유
          </button>
          <button
            className="rounded-lg bg-brand px-4 py-2 text-white"
            onClick={() =>
              addItem({ productId: "green-onion", name: "대파 1단" })
            }
          >
            대파
          </button>
          <button
            className="rounded-lg bg-brand px-4 py-2 text-white"
            onClick={() =>
              addItem({ productId: "tofu-300g", name: "풀무원 두부 300g" })
            }
          >
            두부
          </button>
          <button
            className="rounded-lg bg-brand px-4 py-2 text-white"
            onClick={() => addItem({ productId: "egg-30", name: "계란 30구" })}
          >
            계란
          </button>
        </div>

        {!hasHydrated ? (
          <div className="space-y-2">
            <div className="h-6 animate-pulse rounded bg-gray-200" />
            <div className="h-6 animate-pulse rounded bg-gray-200" />
          </div>
        ) : items.length === 0 ? (
          <p>장바구니가 비어 있어요</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {items.map((item) => (
              <CartItemCard
                key={item.productId}
                item={item}
                product={mockPriceSnapshot.products[item.productId]}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
