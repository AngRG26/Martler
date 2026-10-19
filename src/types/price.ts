export type MartId = "emart" | "lottemart";

export const MART_LABEL: Record<MartId, string> = {
  emart: "이마트",
  lottemart: "롯데마트",
};

export type MartPrice = {
  price: number; // 원 단위 숫자. "2,980원" 같은 표시는 화면에서 처리
  isSale: boolean; // 행사가 여부
};

export type Product = {
  productId: string;
  name: string;
  maker: string;
  // 마트 키가 아예 없으면 "가격 정보 없음"
  prices: Partial<Record<MartId, MartPrice>>;
};

export type PriceSnapshot = {
  surveyedAt: string; // 조사일 'YYYY-MM-DD'
  products: Record<string, Product>; // productId로 바로 찾기
};
