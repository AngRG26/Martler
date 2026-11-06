import type { CartItem } from "./cart";
import type { CartComparison } from "@/lib/price";
import type { SelectedMarts } from "./mart";

export type ListPriceSummary = Omit<CartComparison, "excluded"> & {
  surveyedAt: string;
  marts: SelectedMarts; // 추가: 확정 당시의 내 매장, 비교 지점
};

export type ShoppingList = {
  id: string;
  title: string; // '10월 23일 장보기'
  confirmedAt: string; // '2026-10-23T00:40:00.000Z'
  items: CartItem[];
  priceSummary: ListPriceSummary | null; // 비교할 수 있는 상품이 없었으면 null
};
