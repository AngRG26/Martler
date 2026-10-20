import { MARTS, type MartId, type Product } from "@/types/price";

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
