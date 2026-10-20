"use client";

import type { CartItem } from "@/types/cart";
import {
  MARTS,
  MART_LABEL,
  type MartId,
  type MartPrice,
  type Product,
} from "@/types/price";
import { formatPrice, getBestMarts } from "@/lib/price";
import { useCartStore } from "@/stores/cart-store-provider";

type CartItemCardProps = {
  item: CartItem;
  product: Product | undefined; // 가격 데이터에 없는 상품일 수 있음
};

export function CartItemCard({ item, product }: CartItemCardProps) {
  const changeQuantity = useCartStore((s) => s.changeQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const bestMarts = product ? getBestMarts(product) : [];

  return (
    <li className="flex flex-col gap-2.5 rounded-[14px] bg-white p-3.5 shadow-[0_1px_2px_rgba(15,27,45,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-[15px] font-semibold text-ink">
            {item.name}
          </span>
          {product && (
            <span className="text-xs text-muted">{product.maker}</span>
          )}
        </div>

        <div className="flex shrink-0 items-center rounded-[10px] border border-line">
          {item.quantity === 1 ? (
            <button
              type="button"
              aria-label={`${item.name} 삭제`}
              onClick={() => removeItem(item.productId)}
              className="flex size-10 items-center justify-center text-muted"
            >
              <TrashIcon />
            </button>
          ) : (
            <button
              type="button"
              aria-label="수량 줄이기"
              onClick={() => changeQuantity(item.productId, -1)}
              className="size-10 text-lg text-ink"
            >
              −
            </button>
          )}
          <span className="min-w-6 text-center text-[15px] font-semibold tabular-nums text-ink">
            {item.quantity}
          </span>
          <button
            type="button"
            aria-label="수량 늘리기"
            onClick={() => changeQuantity(item.productId, 1)}
            className="size-10 text-lg text-ink"
          >
            +
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {MARTS.map((mart) => (
          <PriceCell
            key={mart}
            mart={mart}
            price={product?.prices[mart]}
            isBest={bestMarts.includes(mart)}
          />
        ))}
      </div>
    </li>
  );
}

type PriceCellProps = {
  mart: MartId;
  price: MartPrice | undefined;
  isBest: boolean;
};

function PriceCell({ mart, price, isBest }: PriceCellProps) {
  return (
    <div
      className={`flex flex-col gap-0.5 rounded-[10px] border px-2.5 py-2 ${
        isBest ? "border-brand/30 bg-brand-soft" : "border-line bg-canvas"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{MART_LABEL[mart]}</span>
        <span className="flex gap-1">
          {price?.isSale && (
            <span className="rounded bg-sale-soft px-1.5 py-0.5 text-[11px] font-semibold text-sale">
              행사가
            </span>
          )}
          {isBest && (
            <span className="rounded bg-brand px-1.5 py-0.5 text-[11px] font-bold text-white">
              최저
            </span>
          )}
        </span>
      </div>
      {price ? (
        <span
          className={`text-base font-bold tabular-nums ${isBest ? "text-brand" : "text-ink"}`}
        >
          {formatPrice(price.price)}
        </span>
      ) : (
        <span className="py-0.5 text-[13px] text-muted">가격 정보 없음</span>
      )}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </svg>
  );
}
