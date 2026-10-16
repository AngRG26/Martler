"use client";

import { useCartStore } from "@/stores/cart-store-provider";

export default function Home() {
  const items = useCartStore((s) => s.items);
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

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-3">
            <span className="flex-1">{item.name}</span>
            <button onClick={() => changeQuantity(item.productId, -1)}>
              −
            </button>
            <span>{item.quantity}</span>
            <button onClick={() => changeQuantity(item.productId, 1)}>+</button>
            <button onClick={() => removeItem(item.productId)}>삭제</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
