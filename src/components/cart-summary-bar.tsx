import type { CartChange } from "@/lib/price-change"; // 장바구니 전체 변동 계산 결과 타입
import { formatPrice, formatSurveyDate } from "@/lib/price"; // "260원", "10월 23일" 만들기
import { ChangeArrow } from "./change-arrow"; // 위/아래 화살표 아이콘
import { ConfirmListButton } from "./confirm-list-button"; // 리스트 확정 버튼

/** 하단 바의 props */
type CartSummaryBarProps = {
  /** calcCartChange의 결과 */
  change: CartChange;
  /** 내 매장 짧은 이름 (예: '천호점') */
  martName: string;
  /** 이번 조사일 'YYYY-MM-DD' */
  surveyedAt: string;
  /** 지난 조사일. 못 찾았으면 null */
  previousSurveyedAt: string | null;
};

/**
 * 장바구니 아래에 고정되는 바.
 * 지난 조사 대비 장바구니 전체 변동을 크게 보여줘요.
 * (store를 쓰지 않고 받은 값만 그려서 'use client'가 필요 없어요)
 */
export function CartSummaryBar({
  change, // 전체 변동
  martName, // 매장 이름
  surveyedAt, // 이번 조사일
  previousSurveyedAt, // 지난 조사일
}: CartSummaryBarProps) {
  // 계산 결과에서 필요한 값 꺼내기
  const { comparedCount, difference, missingNames } = change;

  // 기간 문구: "10월 23일 → 11월 6일". 지난 조사일이 없으면 null
  const rangeText = previousSurveyedAt
    ? `${formatSurveyDate(previousSurveyedAt)} → ${formatSurveyDate(surveyedAt)}`
    : null;

  // 비교할 수 있는지: 계산에 들어간 상품이 있고, 지난 조사일도 있어야 해요
  const canCompare = comparedCount > 0 && rangeText !== null;
  // 오름인지 (내림이나 같음이면 false)
  const isUp = difference > 0;

  // 큰 글씨 문장 정하기 (경우가 셋이라 JSX 밖에서 미리 정해요)
  let headline: string;
  if (!canCompare) {
    headline = "지난 조사와 비교할 상품이 없어요"; // 비교 불가
  } else if (difference === 0) {
    headline = "지난 조사와 가격이 같아요"; // 변동 없음
  } else {
    // 금액은 부호 없이, 방향은 "올랐어요/내렸어요"로
    headline = `지난 조사보다 ${formatPrice(Math.abs(difference))} ${isUp ? "올랐어요" : "내렸어요"}`;
  }

  // 큰 글씨 색: 오름 빨강, 내림 파랑, 나머지 기본색
  const headlineColor =
    !canCompare || difference === 0
      ? "text-ink"
      : isUp
        ? "text-danger"
        : "text-brand";

  return (
    // 화면 아래에 고정. 하단 탭(72px)과 아이폰 홈 바 높이만큼 위로
    <section
      aria-label="지난 조사 대비 가격 변동" // 화면 낭독기가 읽을 영역 이름
      className="fixed inset-x-0 bottom-[calc(72px+env(safe-area-inset-bottom))] mx-auto flex max-w-[480px] flex-col gap-1 border-t border-line bg-white px-5 pt-3.5 pb-4 shadow-[0_-4px_16px_rgba(15,27,45,0.06)]"
    >
      {/* 큰 글씨: 화살표(변동 있을 때만) + 문장 */}
      <p
        className={`flex items-center gap-1 text-[17px] font-bold ${headlineColor}`}
      >
        {canCompare && difference !== 0 && <ChangeArrow up={isUp} />}
        {headline}
      </p>

      {/* 기준 설명: "천호점, 같은 3개 상품 기준 (10월 23일 → 11월 6일)" */}
      {canCompare && (
        <p className="text-xs text-muted">
          {martName}, 같은 {comparedCount}개 상품 기준 ({rangeText})
        </p>
      )}

      {/* 이번 조사에 없어서 계산에서 빠진 상품 (있을 때만) */}
      {missingNames.length > 0 && (
        <p className="text-xs text-muted">
          이번 조사에 없는 상품: {missingNames.join(", ")}
        </p>
      )}

      {/* 리스트 확정 버튼 (하단 바가 이미 받은 값을 그대로 넘겨요) */}
      <ConfirmListButton
        change={change} // 전체 변동
        surveyedAt={surveyedAt} // 이번 조사일
        previousSurveyedAt={previousSurveyedAt} // 지난 조사일
      />
    </section>
  );
}
