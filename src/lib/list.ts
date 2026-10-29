import type { CartItem } from "@/types/cart";
import type { CartComparison } from "@/lib/price";
import type { ShoppingList } from "@/types/list";

const SUMMARY_LIMIT = 4;

export function createId() {
  // randomUUID는 https나 localhost에서만 쓸 수 있어요
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createShoppingList(
  items: CartItem[],
  comparison: CartComparison,
  surveyedAt: string,
  now: Date = new Date(),
): ShoppingList {
  return {
    id: createId(),
    title: `${now.getMonth() + 1}월 ${now.getDate()}일 장보기`,
    confirmedAt: now.toISOString(),
    items,
    priceSummary:
      comparison.comparedCount > 0
        ? {
            totals: comparison.totals,
            comparedCount: comparison.comparedCount,
            cheaperMarts: comparison.cheaperMarts,
            difference: comparison.difference,
            surveyedAt,
          }
        : null,
  };
}

// "서울우유 1L ×2, 대파 1단, ... 외 2개"
export function summarizeItems(items: CartItem[]) {
  const names = items.map((item) =>
    item.quantity > 1 ? `${item.name} ×${item.quantity}` : item.name,
  );
  if (names.length <= SUMMARY_LIMIT) return names.join(", ");
  return `${names.slice(0, SUMMARY_LIMIT).join(", ")} 외 ${names.length - SUMMARY_LIMIT}개`;
}

// '2026-10-25T12:10:00.000Z' → '10.25'
export function formatConfirmedDate(iso: string) {
  const date = new Date(iso);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}.${day}`;
}
