import type { CartItem } from "@/types/cart";
import type { CartComparison } from "@/lib/price";
import type { ShoppingList } from "@/types/list";

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
