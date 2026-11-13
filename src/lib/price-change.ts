import type { CartItem } from "@/types/cart";
import type { ProductPrice } from "@/types/snapshot";

// ----- 상품 하나의 변동 (카드에서 사용) -----

// 카드가 보여줄 네 가지 경우 (5-3의 표와 같아요)
export type PriceChange =
  | { kind: "changed"; diff: number } // 가격이 바뀜. diff > 0 오름, < 0 내림
  | { kind: "same" } // 지난 조사와 같음
  | { kind: "new" } // 이번에 처음 조사됨 (지난 가격 없음)
  | { kind: "missing"; lastPrice: number }; // 이번 조사에서 빠짐 (지난 가격만 있음)

export function getPriceChange(product: ProductPrice): PriceChange | null {
  const { current, previousPrice } = product;

  if (current && previousPrice !== undefined) {
    const diff = current.price - previousPrice;
    return diff === 0 ? { kind: "same" } : { kind: "changed", diff };
  }
  if (current) return { kind: "new" };
  if (previousPrice !== undefined)
    return { kind: "missing", lastPrice: previousPrice };

  return null; // 둘 다 없음 (서버가 이런 상품은 안 보내지만 타입상 필요해요)
}

// ----- 장바구니 전체 변동 (하단 바에서 사용) -----

export type CartChange = {
  comparedCount: number; // 이번, 지난 가격이 둘 다 있어서 계산에 들어간 상품 수
  difference: number; // 전체 변동 금액 (수량 반영). > 0 오름, < 0 내림
  missingNames: string[]; // 이번 조사에 없어서 계산에서 빠진 상품
};

export function calcCartChange(
  items: CartItem[],
  products: Record<string, ProductPrice>,
): CartChange {
  let comparedCount = 0;
  let difference = 0;
  const missingNames: string[] = [];

  for (const item of items) {
    // Record<string, X>의 함정: 없는 키도 있다고 착각하니 직접 적어줘요
    const product = products[item.productId] as ProductPrice | undefined;

    // 이번 가격이 없으면 (조사에서 빠졌거나, 이 매장 상품이 아니거나) 계산 불가
    if (!product?.current) {
      missingNames.push(item.name);
      continue;
    }

    // 처음 조사된 상품은 비교할 지난 가격이 없어요. 빠진 건 아니니 이름은 안 넣어요
    if (product.previousPrice === undefined) continue;

    // (이번 - 지난) × 수량. 우유 2개가 10원씩 내리면 -20원
    difference +=
      (product.current.price - product.previousPrice) * item.quantity;
    comparedCount += 1;
  }

  return { comparedCount, difference, missingNames };
}
