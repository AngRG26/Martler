import type { PriceSnapshot } from "@/types/price";

export const mockPriceSnapshot: PriceSnapshot = {
  surveyedAt: "2026-09-25",
  products: {
    "milk-1l": {
      productId: "milk-1l",
      name: "서울우유 1L",
      maker: "서울우유협동조합",
      prices: {
        emart: { price: 2980, isSale: false },
        lottemart: { price: 3150, isSale: false },
      },
    },
    "green-onion": {
      productId: "green-onion",
      name: "대파 1단",
      maker: "농산물",
      prices: {
        emart: { price: 2480, isSale: false },
        // lottemart 없음 → 가격 정보 없음
      },
    },
    "tofu-300g": {
      productId: "tofu-300g",
      name: "풀무원 두부 300g",
      maker: "풀무원",
      prices: {
        emart: { price: 1980, isSale: false },
        lottemart: { price: 2100, isSale: false },
      },
    },
    "egg-30": {
      productId: "egg-30",
      name: "계란 30구",
      maker: "농협",
      prices: {
        emart: { price: 7480, isSale: false },
        lottemart: { price: 6990, isSale: true },
      },
    },
  },
};
