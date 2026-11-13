import type { CartItem } from "@/types/cart"; // 장바구니 아이템 타입
import type { SelectedMart } from "@/types/mart"; // 매장 타입
import type { ShoppingList } from "@/types/list"; // 저장할 리스트 타입
import type { CartChange } from "@/lib/price-change"; // 장바구니 전체 변동 계산 결과 타입

/**
 * 겹치지 않는 ID를 만들어요.
 * crypto.randomUUID는 https나 localhost에서만 있어서, 없으면 시각과 난수로 대신 만들어요.
 * (폰에서 http://192.168.x.x로 접속하면 randomUUID가 없어요)
 */
export function createId() {
  // randomUUID를 쓸 수 있는 환경인지 확인
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID(); // 예: '3b241101-e2bb-4255-8caf-4136c566a962'
  }
  // 대비책: 현재 시각(36진수) + 난수 8글자
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * createShoppingList에 넘기는 값들.
 * 인자가 여섯 개라 순서를 헷갈리기 쉬워서, 이름이 붙은 객체 하나로 받아요.
 */
export type CreateShoppingListInput = {
  /** 장바구니 아이템들 */
  items: CartItem[];
  /** calcCartChange의 결과 */
  change: CartChange;
  /** 이번 조사일 'YYYY-MM-DD' */
  surveyedAt: string;
  /** 지난 조사일. 못 찾았으면 null */
  previousSurveyedAt: string | null;
  /** 지금 고른 내 매장 */
  mart: SelectedMart;
  /** 확정 시각. 생략하면 지금 (테스트할 때 원하는 날짜를 넣을 수 있어요) */
  now?: Date;
};

/**
 * 장바구니를 확정해서 저장할 리스트 하나를 만들어요.
 * @returns 제목, 상품, 확정 당시 가격 변동 기록이 담긴 리스트
 */
export function createShoppingList({
  items, // 장바구니 아이템
  change, // 전체 변동
  surveyedAt, // 이번 조사일
  previousSurveyedAt, // 지난 조사일 (null일 수 있음)
  mart, // 내 매장
  now = new Date(), // 안 넘기면 지금 시각
}: CreateShoppingListInput): ShoppingList {
  return {
    id: createId(), // 겹치지 않는 ID
    title: `${now.getMonth() + 1}월 ${now.getDate()}일 장보기`, // getMonth()는 0부터라 +1
    confirmedAt: now.toISOString(), // UTC 문자열로 저장
    items, // 담았던 상품 그대로
    // 비교할 상품이 있고 지난 조사일도 있을 때만 기록을 남겨요
    // (조건을 이 자리에 바로 쓰면, 오른쪽 객체 안에서 previousSurveyedAt이 string으로 좁혀져요)
    priceSummary:
      change.comparedCount > 0 && previousSurveyedAt !== null
        ? {
            mart, // 확정 당시 매장
            surveyedAt, // 이번 조사일
            previousSurveyedAt, // 지난 조사일 (여기서는 확실히 string)
            comparedCount: change.comparedCount, // 계산에 들어간 상품 수
            difference: change.difference, // 전체 변동 금액
          }
        : null, // 비교할 게 없었으면 기록 없음
  };
}

/** 상품 이름을 몇 개까지 보여주고 나머지는 "외 N개"로 줄일지 */
const SUMMARY_LIMIT = 4;

/**
 * 리스트 카드에 보여줄 상품 요약.
 * @example summarizeItems(items) // "서울우유 1L ×2, 두부, 계란, 대파 외 2개"
 */
export function summarizeItems(items: CartItem[]) {
  // 수량이 2개 이상이면 "이름 ×수량", 1개면 이름만
  const names = items.map((item) =>
    item.quantity > 1 ? `${item.name} ×${item.quantity}` : item.name,
  );
  // 4개 이하면 전부 쉼표로 이어서
  if (names.length <= SUMMARY_LIMIT) return names.join(", ");
  // 넘으면 앞 4개 + "외 N개"
  return `${names.slice(0, SUMMARY_LIMIT).join(", ")} 외 ${names.length - SUMMARY_LIMIT}개`;
}

/**
 * 확정 시각을 "MM.DD"로.
 * 시각과 Z(UTC)까지 있는 정확한 순간이라 new Date로 읽으면 기기 시간대로 바르게 바뀌어요.
 * @example formatConfirmedDate('2026-11-13T05:00:00.000Z') // '11.13'
 */
export function formatConfirmedDate(iso: string) {
  const date = new Date(iso); // 문자열 → Date
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 9 → '09'
  const day = String(date.getDate()).padStart(2, "0"); // 5 → '05'
  return `${month}.${day}`; // '11.13'
}
