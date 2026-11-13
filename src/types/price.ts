// 마트 "자리" 이름: 내 매장(home), 비교 지점(rival)
export type MartSlot = "home" | "rival";

// 자리 목록. 카드에서 가격 칸을 그릴 때 이 순서대로 map 해요
export const MART_SLOTS: MartSlot[] = ["home", "rival"];

// (MART_LABEL은 4-3에서 지웠어요. 이름은 useMartLabels()가 만들어요)

// 한 매장의 상품 가격 하나
export type MartPrice = {
  // 가격 (원)
  price: number;
  // 할인 중인지 (API의 goodDcYn === 'Y')
  isSale: boolean;
  // 1+1인지 (API의 plusoneYn === 'Y')
  isOnePlusOne: boolean;
};

// 상품 하나 (목업과 지금 화면이 쓰는 모양. 5-6에서 지울 예정)
export type Product = {
  // 상품 ID (참가격 goodId)
  productId: string;
  // 상품 이름
  name: string;
  // 제조사. API에 이름이 없어서 선택
  maker?: string;
  // 자리별 가격. 없는 자리는 "가격 정보 없음"
  prices: Partial<Record<MartSlot, MartPrice>>;
  // 내 매장의 지난 조사 가격. 없으면 처음 조사된 상품
  previousPrice?: number;
};

// 가격 묶음 전체 (목업이 쓰는 모양. 5-6에서 지울 예정)
export type PriceSnapshot = {
  // 이번 조사일 'YYYY-MM-DD'
  surveyedAt: string;
  // 지난 조사일. 못 찾으면 null
  previousSurveyedAt: string | null;
  // 상품 ID로 바로 찾을 수 있게 객체로
  products: Record<string, Product>;
};
