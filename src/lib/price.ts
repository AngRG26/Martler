import { MARTS, type MartId, type Product } from "@/types/price";
import type { CartItem } from "@/types/cart";

const krw = new Intl.NumberFormat("ko-KR");

export function formatPrice(price: number) {
  return `${krw.format(price)}원`; // 2980 → "2,980원"
}

// 두 마트 모두 가격이 있을 때만 최저가를 정해요. 값이 같으면 둘 다 최저예요.
export function getBestMarts(product: Product): MartId[] {
  const priced = MARTS.filter((mart) => product.prices[mart] !== undefined);
  if (priced.length < 2) return [];

  const min = Math.min(...priced.map((mart) => product.prices[mart]!.price));
  return priced.filter((mart) => product.prices[mart]!.price === min);
}

export type CartComparison = {
  totals: Record<MartId, number>; // 마트별 합계
  comparedCount: number; // 비교에 들어간 상품 수
  excluded: ExcludedItem[];
  cheaperMarts: MartId[]; // 합계가 더 싼 마트 (같으면 둘 다)
  difference: number; // 비싼 쪽 합계 - 싼 쪽 합계
};

export type ExcludedItem = {
  name: string;
  missingMarts: MartId[]; // 가격이 없는 마트
};

export function compareCart(
  items: CartItem[],
  products: Record<string, Product>,
): CartComparison {
  const totals: Record<MartId, number> = { emart: 0, lottemart: 0 };
  const excluded: ExcludedItem[] = [];
  let comparedCount = 0;

  for (const item of items) {
    const product = products[item.productId] as Product | undefined;

    // 가격 데이터에 상품 자체가 없음 → 모든 마트 가격 없음
    if (!product) {
      excluded.push({ name: item.name, missingMarts: [...MARTS] });
      continue;
    }

    // 가격이 없는 마트만 골라냄
    const missingMarts = MARTS.filter(
      (mart) => product.prices[mart] === undefined,
    );
    if (missingMarts.length > 0) {
      excluded.push({ name: item.name, missingMarts });
      continue;
    }
    for (const mart of MARTS) {
      totals[mart] += product.prices[mart]!.price * item.quantity;
    }
    comparedCount += 1;
  }

  if (comparedCount === 0) {
    return { totals, comparedCount, excluded, cheaperMarts: [], difference: 0 };
  }

  const values = MARTS.map((mart) => totals[mart]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const cheaperMarts = MARTS.filter((mart) => totals[mart] === min);

  return {
    totals,
    comparedCount,
    excluded,
    cheaperMarts,
    difference: max - min,
  };
}

// '2026-09-25' → '9월 25일'
export function formatSurveyDate(date: string) {
  const [, month, day] = date.split("-").map(Number);
  return `${month}월 ${day}일`;
}
