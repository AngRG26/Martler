export type MartSlot = "home" | "rival"; // 내 매장, 비교 지점

// 임시: 4-2에서 사용자가 고른 매장 이름으로 바꿀 거예요
export const MART_LABEL: Record<MartSlot, string> = {
  home: "천호점",
  rival: "부천점",
};

export const MART_SLOTS: MartSlot[] = ["home", "rival"];

export type MartPrice = {
  price: number; // 원 단위 숫자. "2,980원" 같은 표시는 화면에서 처리
  isSale: boolean; // 행사가 여부
};

export type Product = {
  productId: string;
  name: string;
  maker: string;
  // 마트 키가 아예 없으면 "가격 정보 없음"
  prices: Partial<Record<MartSlot, MartPrice>>;
};

export type PriceSnapshot = {
  surveyedAt: string; // 조사일 'YYYY-MM-DD'
  products: Record<string, Product>; // productId로 바로 찾기
};
