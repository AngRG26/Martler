import type { CartItem } from "@/types/cart";

// 즐겨찾기 store를 만들기 전까지 쓸 가짜 데이터
export const mockFavorites: Omit<CartItem, "quantity">[] = [
  { productId: "milk-1l", name: "서울우유 1L" },
  { productId: "tofu-300g", name: "풀무원 두부 300g" },
  { productId: "egg-30", name: "계란 30구" },
  { productId: "green-onion", name: "대파 1단" },
];
