"use client";

import type { CartItem } from "@/types/cart";
import { useCartStore } from "@/stores/cart-store-provider";

type FavoriteChipsProps = {
  favorites: Omit<CartItem, "quantity">[];
};

export function FavoriteChips({ favorites }: FavoriteChipsProps) {
  const addItem = useCartStore((s) => s.addItem);

  if (favorites.length === 0) return null;

  return (
    <section className="flex flex-col gap-2 pt-3.5 pb-1">
      <h2 className="px-5 text-sm font-semibold text-ink">즐겨찾기에서 담기</h2>
      <ul className="flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
        {favorites.map((fav) => (
          <li key={fav.productId} className="shrink-0">
            <button
              type="button"
              onClick={() => addItem(fav)}
              aria-label={`${fav.name} 장바구니에 담기`}
              className="flex min-h-10 items-center gap-1.5 rounded-full border border-line bg-white px-3 text-[13px] text-ink"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                aria-hidden="true"
                className="text-brand"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              {fav.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
