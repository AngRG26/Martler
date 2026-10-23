import type { CartItem } from "./cart";
import type { CartComparison } from "@/lib/price";

// 확정 당시의 가격 비교 결과 (제외 목록은 빼고 조사일을 더함)
export type ListPriceSummary = Omit<CartComparison, "excluded"> & {
  surveyedAt: string;
};

export type ShoppingList = {
  id: string;
  title: string; // '10월 23일 장보기'
  confirmedAt: string; // '2026-10-23T00:40:00.000Z'
  items: CartItem[];
  priceSummary: ListPriceSummary | null; // 비교할 수 있는 상품이 없었으면 null
};
