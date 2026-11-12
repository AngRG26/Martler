import type { CartItem } from "@/types/cart";

// 실제 참가격 goodId로 바꿨어요 (2026-11-12 상품 목록에서 확인)
export const mockFavorites: Omit<CartItem, "quantity">[] = [
  { productId: "224", name: "서울우유 흰우유(1L)" },
  { productId: "966", name: "행복한콩 찌개두부(300g)" },
  { productId: "1598", name: "CJ 1등급 깨끗한 계란(10개)" },
  { productId: "935", name: "대파(흙대파, 500~800g)" },
];
