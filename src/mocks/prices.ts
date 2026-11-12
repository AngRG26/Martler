import type { PriceSnapshot } from "@/types/price";

// 5-3에서 실제 API로 바꾸면 지울 파일이에요
export const mockPriceSnapshot: PriceSnapshot = {
  surveyedAt: "2026-09-25",
  previousSurveyedAt: null, // 목업에는 지난 조사가 없어요

  products: {
    "milk-1l": {
      productId: "milk-1l",
      name: "서울우유 1L",
      maker: "서울우유협동조합",
      prices: {
        home: { price: 2980, isSale: false, isOnePlusOne: false },
        rival: { price: 3150, isSale: false, isOnePlusOne: false },
      },
    },
    "green-onion": {
      productId: "green-onion",
      name: "대파 1단",
      maker: "농산물",
      prices: {
        home: { price: 2480, isSale: false, isOnePlusOne: false },
        // rival 없음 → 가격 정보 없음
      },
    },
    "tofu-300g": {
      productId: "tofu-300g",
      name: "풀무원 두부 300g",
      maker: "풀무원",
      prices: {
        home: { price: 1980, isSale: false, isOnePlusOne: false },
        rival: { price: 2100, isSale: false, isOnePlusOne: false },
      },
    },
    "egg-30": {
      productId: "egg-30",
      name: "계란 30구",
      maker: "농협",
      prices: {
        home: { price: 7480, isSale: false, isOnePlusOne: false },
        rival: { price: 6990, isSale: true, isOnePlusOne: false }, // 행사가
      },
    },
  },
};
