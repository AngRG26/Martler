import { fetchProducts, fetchStorePrices } from "@/lib/kca/client";

// 임시 확인용: 같은 날 천호점과 부천점의 가격이 얼마나 다른지 전체 상품으로 세기
const DAY = "20261106";

export async function GET() {
  const products = await fetchProducts();
  const nameOf = new Map(products.map((p) => [p.goodId, p.goodName] as const));

  const home = await fetchStorePrices("946", DAY); // 천호점
  const rival = await fetchStorePrices("10", DAY); // 부천점

  // 부천점 가격을 goodId로 바로 찾을 수 있게
  const rivalPrice = new Map(
    rival.map((p) => [p.goodId, p.goodPrice] as const),
  );

  let both = 0; // 두 매장 모두 있는 상품 수
  const different: string[] = []; // 가격이 다른 상품

  for (const p of home) {
    const other = rivalPrice.get(p.goodId);
    if (other === undefined) continue; // 부천점에 없으면 비교 불가

    both += 1;
    if (other !== p.goodPrice) {
      different.push(
        `${nameOf.get(p.goodId)}: 천호 ${p.goodPrice} / 부천 ${other}`,
      );
    }
  }

  return Response.json({
    homeCount: home.length,
    rivalCount: rival.length,
    both,
    differentCount: different.length,
    different, // 가격이 다른 상품 목록 (있다면)
  });
}
