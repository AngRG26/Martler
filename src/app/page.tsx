"use client";

import { useCartStore } from "@/stores/cart-store-provider";

export default function Home() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const addItem = useCartStore((s) => s.addItem);
  const changeQuantity = useCartStore((s) => s.changeQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <main className="p-5 space-y-4">
      <div className="flex gap-2">
        <button
          className="rounded-lg bg-[#1F4E8C] px-4 py-2 text-white"
          onClick={() => addItem({ productId: "1", name: "서울우유 1L" })}
        >
          우유 담기
        </button>
        <button
          className="rounded-lg bg-[#1F4E8C] px-4 py-2 text-white"
          onClick={() => addItem({ productId: "2", name: "계란 30구" })}
        >
          계란 담기
        </button>
      </div>

      {!hasHydrated ? (
        // 1. 아직 불러오는 중 → 스켈레톤
        <div className="space-y-2">
          <div className="h-6 animate-pulse rounded bg-gray-200" />
          <div className="h-6 animate-pulse rounded bg-gray-200" />
        </div>
      ) : items.length === 0 ? (
        // 2. 불러왔는데 비어 있음
        <p>장바구니가 비어 있어요</p>
      ) : (
        // 3. 불러왔고 상품 있음
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-3">
              <span className="flex-1">{item.name}</span>
              <button onClick={() => changeQuantity(item.productId, -1)}>
                −
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => changeQuantity(item.productId, 1)}>
                +
              </button>
              <button onClick={() => removeItem(item.productId)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
