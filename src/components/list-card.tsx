import type { ShoppingList } from "@/types/list"; // 리스트 타입
import { formatPrice, formatSurveyDate } from "@/lib/price"; // "90원", "10월 23일"
import { formatConfirmedDate, summarizeItems } from "@/lib/list"; // "11.13", 상품 요약
import { shortMartName } from "@/lib/mart"; // '이마트천호점' → '천호점'
import { ChangeArrow } from "./change-arrow"; // 위/아래 화살표

/** 리스트 카드의 props */
type ListCardProps = {
  /** 보여줄 리스트 */
  list: ShoppingList;
};

/**
 * 내 리스트 화면의 카드 하나.
 * 제목, 확정일, 상품 요약, 확정 당시 가격 변동, 버튼 두 개를 보여줘요.
 * (store를 안 쓰고 받은 값만 그려서 'use client'가 없어요)
 */
export function ListCard({ list }: ListCardProps) {
  // 리스트에서 필요한 값 꺼내기
  const { title, confirmedAt, items, priceSummary } = list;

  return (
    // 카드 전체: 흰 배경, 둥근 모서리
    <li className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(15,27,45,0.06)]">
      {/* 제목(왼쪽) + 확정일(오른쪽) */}
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        <span className="shrink-0 text-xs text-muted">
          {formatConfirmedDate(confirmedAt)} 확정
        </span>
      </div>

      {/* 상품 요약: "서울우유 1L ×2, 두부 외 2개" */}
      <p className="text-sm leading-normal text-ink">{summarizeItems(items)}</p>

      {/* 확정 당시 가격 변동 */}
      <PriceSummary summary={priceSummary} />

      {/* 버튼 두 개 (폐기는 다음 단계, 냉장고 등록은 냉장고 작업 때 연결) */}
      <div className="flex gap-2">
        <button
          type="button" // 폼 제출 버튼이 아님
          className="min-h-12 shrink-0 rounded-xl border border-line px-4 text-sm font-medium text-danger" // 빨간 글씨 테두리 버튼
        >
          리스트 폐기
        </button>
        <button
          type="button" // 폼 제출 버튼이 아님
          className="min-h-12 grow rounded-xl bg-brand text-[15px] font-semibold text-white" // 남은 폭을 채우는 파란 버튼
        >
          냉장고에 등록하기
        </button>
      </div>
    </li>
  );
}

/** PriceSummary의 props */
type PriceSummaryProps = {
  /** 확정 당시 가격 변동 기록 (타입에서 이 필드 타입만 꺼내 써요) */
  summary: ShoppingList["priceSummary"];
};

/** 카드 안의 회색 상자: 확정 당시 지난 조사 대비 변동 */
function PriceSummary({ summary }: PriceSummaryProps) {
  // 기록이 없으면 (비교할 상품이 없었거나, 예전 형식이라 비워진 리스트) 안내만
  if (!summary) {
    return (
      <p className="rounded-[10px] bg-canvas px-3 py-2.5 text-[13px] text-muted">
        지난 조사와 비교한 기록이 없어요
      </p>
    );
  }

  // 여기부터 summary는 확실히 있어요
  const { mart, surveyedAt, previousSurveyedAt, comparedCount, difference } =
    summary;
  const isUp = difference > 0; // 0보다 크면 오름

  // 큰 글씨 문장: 같음 / 오름 / 내림
  const headline =
    difference === 0
      ? "지난 조사와 가격이 같았어요"
      : `지난 조사보다 ${formatPrice(Math.abs(difference))} ${isUp ? "올랐어요" : "내렸어요"}`;

  // 글씨 색: 같음 기본색, 오름 빨강, 내림 파랑
  const color =
    difference === 0 ? "text-ink" : isUp ? "text-danger" : "text-brand";

  return (
    // 회색 상자
    <div className="flex flex-col gap-1 rounded-[10px] bg-canvas px-3 py-2.5">
      {/* 화살표(변동 있을 때만) + 문장 */}
      <p className={`flex items-center gap-1 text-sm font-semibold ${color}`}>
        {difference !== 0 && <ChangeArrow up={isUp} />}
        {headline}
      </p>
      {/* 기준: "천호점, 같은 2개 상품 기준 (10월 23일 → 11월 6일)" */}
      <p className="text-xs text-muted">
        {shortMartName(mart.name)}, 같은 {comparedCount}개 상품 기준 (
        {formatSurveyDate(previousSurveyedAt)} → {formatSurveyDate(surveyedAt)})
      </p>
    </div>
  );
}
