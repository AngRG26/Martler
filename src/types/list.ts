import type { CartItem } from "./cart"; // 장바구니 아이템 타입 (상품 ID, 이름, 수량)
import type { SelectedMart } from "./mart"; // 매장 타입 (entpId, 이름)

/**
 * 리스트를 확정할 때 함께 저장하는 가격 변동 기록.
 * 나중에 매장을 바꾸거나 새 조사가 나와도, 확정한 그때의 값이 그대로 남아요.
 */
export type ListPriceSummary = {
  /** 확정 당시의 내 매장 */
  mart: SelectedMart;
  /** 이번 조사일 'YYYY-MM-DD' */
  surveyedAt: string;
  /** 지난 조사일 'YYYY-MM-DD' (비교할 수 있을 때만 저장하니까 null이 없어요) */
  previousSurveyedAt: string;
  /** 변동 계산에 들어간 상품 수 */
  comparedCount: number;
  /** 장바구니 전체 변동 금액 (수량 반영). 양수면 오름, 음수면 내림 */
  difference: number;
};

/** 확정한 장보기 리스트 하나 */
export type ShoppingList = {
  /** 겹치지 않는 ID (createId로 만들어요) */
  id: string;
  /** 제목 (예: '11월 13일 장보기') */
  title: string;
  /** 확정한 시각. localStorage에 넣으려고 Date가 아니라 UTC 문자열로 저장해요 */
  confirmedAt: string;
  /** 확정할 때 장바구니에 있던 상품들 */
  items: CartItem[];
  /** 가격 변동 기록. 비교할 상품이 없었으면 null */
  priceSummary: ListPriceSummary | null;
};
