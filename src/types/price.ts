export type MartSlot = "home" | "rival"; // 내 매장, 비교 지점

// 임시: 4-2에서 사용자가 고른 매장 이름으로 바꿀 거예요
export const MART_LABEL: Record<MartSlot, string> = {
  home: "천호점",
  rival: "부천점",
};

export const MART_SLOTS: MartSlot[] = ["home", "rival"];

export type MartPrice = {
  price: number;
  isSale: boolean; // 할인 중 (API의 goodDcYn === 'Y')
  isOnePlusOne: boolean; // 1+1 (API의 plusoneYn === 'Y') ← 추가
};

export type Product = {
  productId: string;
  name: string;
  maker?: string; // API에는 제조사 이름이 없어서 선택으로 바꿔요
  prices: Partial<Record<MartSlot, MartPrice>>;
  previousPrice?: number; // 내 매장의 "지난 조사" 가격. 없으면 처음 조사된 상품 ← 추가
};

export type PriceSnapshot = {
  surveyedAt: string; // 이번 조사일 'YYYY-MM-DD'
  previousSurveyedAt: string | null; // 지난 조사일. 못 찾으면 null ← 추가
  products: Record<string, Product>;
};
