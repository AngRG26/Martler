import "server-only";
import { fetchProducts, fetchStorePrices, type KcaPrice } from "./client";
import { findSurveyDays } from "./survey-day";
import type { MartPrice, PriceSnapshot, Product } from "@/types/price";

// '20261009' → '2026-10-09'
// 화면의 formatSurveyDate가 '-'로 나누기 때문에 모양을 맞춰요
function toDashedDay(day: string) {
  return `${day.slice(0, 4)}-${day.slice(4, 6)}-${day.slice(6, 8)}`;
}

// API 가격 한 줄 → 우리 앱의 MartPrice
function toMartPrice(raw: KcaPrice): MartPrice {
  return {
    price: Number(raw.goodPrice), // "7590"(문자열) → 7590(숫자). 그래야 더할 수 있어요
    isSale: raw.goodDcYn === "Y", // 필드가 아예 없으면 undefined === 'Y' → false
    isOnePlusOne: raw.plusoneYn === "Y",
  };
}

// 가격 배열을 goodId로 바로 찾을 수 있게 Map으로 바꿔요
// 배열.find()는 매번 처음부터 찾지만, Map.get()은 바로 꺼내요
// (상품 604개 × 매장 3곳을 반복하니까 차이가 커요)
function byGoodId(prices: KcaPrice[]) {
  return new Map(prices.map((p) => [p.goodId, p] as const));
}

export async function getPriceSnapshot(
  homeId: string,
  rivalId: string,
): Promise<PriceSnapshot | null> {
  // 1. 내 매장 기준으로 이번/지난 조사일 찾기
  //    3단계에서 만든 함수라, 그날 가격 목록도 같이 돌려줘요
  const { current, previous } = await findSurveyDays(homeId);
  if (!current) return null; // 최근 8주 동안 데이터가 없음

  // 2. 비교 지점 가격과 상품 목록은 서로 기다릴 필요가 없어서 동시에 불러요
  //    (조사일 찾기는 "찾으면 멈추기" 때문에 하나씩, 여기는 둘 다 꼭 필요해서 동시에)
  //    비교 지점도 "내 매장의 이번 조사일" 가격으로 가져와야 같은 날끼리 비교돼요
  const [rivalPrices, products] = await Promise.all([
    fetchStorePrices(rivalId, current.day),
    fetchProducts(),
  ]);

  const homeNow = byGoodId(current.prices);
  const homeBefore = byGoodId(previous?.prices ?? []); // 지난 조사가 없으면 빈 Map
  const rivalNow = byGoodId(rivalPrices);

  const result: Record<string, Product> = {};

  for (const product of products) {
    const home = homeNow.get(product.goodId);
    const rival = rivalNow.get(product.goodId);

    // 두 매장 모두 가격이 없는 상품은 장바구니에 담을 일이 없으니 빼요
    if (!home && !rival) continue;

    // 있는 쪽만 넣어요. 없는 쪽은 키가 없음 = "가격 정보 없음"
    const prices: Product["prices"] = {};
    if (home) prices.home = toMartPrice(home);
    if (rival) prices.rival = toMartPrice(rival);

    const before = homeBefore.get(product.goodId);

    result[product.goodId] = {
      productId: product.goodId,
      name: product.goodName,
      prices,
      previousPrice: before ? Number(before.goodPrice) : undefined,
    };
  }

  return {
    surveyedAt: toDashedDay(current.day),
    previousSurveyedAt: previous ? toDashedDay(previous.day) : null,
    products: result,
  };
}
