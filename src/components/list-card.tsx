import type { ShoppingList } from "@/types/list";
import { MARTS, MART_LABEL } from "@/types/price";
import { formatPrice, formatSurveyDate } from "@/lib/price";
import { formatConfirmedDate, summarizeItems } from "@/lib/list";

type ListCardProps = {
  list: ShoppingList;
};

export function ListCard({ list }: ListCardProps) {
  const { title, confirmedAt, items, priceSummary } = list;

  return (
    <li className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(15,27,45,0.06)]">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        <span className="shrink-0 text-xs text-muted">
          {formatConfirmedDate(confirmedAt)} 확정
        </span>
      </div>

      <p className="text-sm leading-normal text-ink">{summarizeItems(items)}</p>

      <PriceSummary summary={priceSummary} />

      {/* 4단계, 냉장고 작업 때 onClick 연결 */}
      <div className="flex gap-2">
        <button
          type="button"
          className="min-h-12 shrink-0 rounded-xl border border-line px-4 text-sm font-medium text-danger"
        >
          리스트 폐기
        </button>
        <button
          type="button"
          className="min-h-12 grow rounded-xl bg-brand text-[15px] font-semibold text-white"
        >
          냉장고에 등록하기
        </button>
      </div>
    </li>
  );
}

type PriceSummaryProps = {
  summary: ShoppingList["priceSummary"];
};

function PriceSummary({ summary }: PriceSummaryProps) {
  if (!summary) {
    return (
      <p className="rounded-[10px] bg-canvas px-3 py-2.5 text-[13px] text-muted">
        가격을 비교할 수 있는 상품이 없었어요.
      </p>
    );
  }

  const cheaper =
    summary.cheaperMarts.length === 1 ? summary.cheaperMarts[0] : null;
  const headline = cheaper
    ? `동일한 ${summary.comparedCount}개 상품 기준 ${MART_LABEL[cheaper]}가 ${formatPrice(summary.difference)} 더 저렴했어요.`
    : "두 마트 가격이 같았어요.";

  return (
    <div className="flex flex-col gap-1 rounded-[10px] bg-canvas px-3 py-2.5">
      <p
        className={`text-sm font-semibold ${cheaper ? "text-brand" : "text-ink"}`}
      >
        {headline}
      </p>
      <p className="text-xs text-muted">
        {formatSurveyDate(summary.surveyedAt)} 기준
      </p>
      <div className="flex gap-4 text-[13px]">
        {MARTS.map((mart) => (
          <span
            key={mart}
            className={mart === cheaper ? "text-brand" : "text-muted"}
          >
            {MART_LABEL[mart]}{" "}
            <span className="font-semibold tabular-nums">
              {formatPrice(summary.totals[mart])}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
