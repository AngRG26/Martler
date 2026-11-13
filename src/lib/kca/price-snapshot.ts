import "server-only";
import { fetchProducts, type KcaPrice } from "./client";
import { findSurveyDays } from "./survey-day";
import type {
  CurrentPrice,
  MartPriceSnapshot,
  ProductPrice,
} from "@/types/snapshot";

// '20261106' → '2026-11-06'
// 화면의 formatSurveyDate가 '-'로 나누기 때문에 모양을 맞춰요
function toDashedDay(day: string) {
  return `${day.slice(0, 4)}-${day.slice(4, 6)}-${day.slice(6, 8)}`;
}

// API 가격 한 줄 → 우리 앱의 CurrentPrice
function toCurrentPrice(raw: KcaPrice): CurrentPrice {
  return {
    price: Number(raw.goodPrice), // "3270"(문자열) → 3270(숫자). 그래야 더하고 뺄 수 있어요
    isSale: raw.goodDcYn === "Y", // 필드가 아예 없으면 undefined === 'Y' → false
    isOnePlusOne: raw.plusoneYn === "Y",
  };
}

// 가격 배열을 goodId로 바로 찾을 수 있게 Map으로
function byGoodId(prices: KcaPrice[]) {
  return new Map(prices.map((p) => [p.goodId, p] as const));
}

export async function getPriceSnapshot(
  martId: string,
): Promise<MartPriceSnapshot | null> {
  // 1. 이번/지난 조사일과 그날 가격 찾기 (survey-day.ts, 그대로 재사용)
  const { current, previous } = await findSurveyDays(martId);
  if (!current) return null; // 최근 8주 동안 데이터 없음

  // 2. 상품 이름을 붙이려고 전체 상품 목록 (캐시돼서 보통 바로 와요)
  //    비교 지점이 없어져서 동시에 부를 게 하나뿐이라 Promise.all도 필요 없어졌어요
  const products = await fetchProducts();

  const nowById = byGoodId(current.prices);
  const beforeById = byGoodId(previous?.prices ?? []); // 지난 조사가 없으면 빈 Map

  const result: Record<string, ProductPrice> = {};

  for (const product of products) {
    const now = nowById.get(product.goodId);
    const before = beforeById.get(product.goodId);

    // 이번에도 지난번에도 없는 상품은 이 매장과 상관없으니 빼요
    // 5-2와 다른 점: "지난번엔 있었는데 이번에 빠진 상품"도 남겨요
    // (장바구니에 담아둔 우유가 이번 조사에서 빠져도 카드에 뭔가 보여줘야 하니까)
    if (!now && !before) continue;

    result[product.goodId] = {
      productId: product.goodId,
      name: product.goodName,
      current: now ? toCurrentPrice(now) : undefined,
      previousPrice: before ? Number(before.goodPrice) : undefined,
    };
  }

  return {
    martId,
    surveyedAt: toDashedDay(current.day),
    previousSurveyedAt: previous ? toDashedDay(previous.day) : null,
    products: result,
  };
}
