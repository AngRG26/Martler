import { MART_SLOTS, type MartSlot } from "@/types/price";
import {
  formatPrice,
  type CartComparison,
  type ExcludedItem,
} from "@/lib/price";
import { ConfirmListButton } from "./confirm-list-button";

type CartSummaryBarProps = {
  comparison: CartComparison;
  surveyedAt: string;
  labels: Record<MartSlot, string>; // 추가
};

export function CartSummaryBar({
  comparison,
  surveyedAt,
  labels,
}: CartSummaryBarProps) {
  const { totals, comparedCount, excluded, cheaperMarts, difference } =
    comparison;
  const canCompare = comparedCount > 0;
  const cheaper = cheaperMarts.length === 1 ? cheaperMarts[0] : null;

  let headline: string;
  if (!canCompare) {
    headline = "비교할 수 있는 상품이 없어요";
  } else if (cheaper) {
    headline = `${labels[cheaper]}이 ${formatPrice(difference)} 더 저렴해요.`;
  } else {
    headline = "두 마트 가격이 같아요";
  }

  return (
    <section
      aria-label="마트 가격 비교"
      className="fixed inset-x-0 bottom-[calc(72px+env(safe-area-inset-bottom))] mx-auto flex max-w-[480px] flex-col gap-2.5 border-t border-line bg-white px-5 pt-3.5 pb-4 shadow-[0_-4px_16px_rgba(15,27,45,0.06)]"
    >
      <div className="flex flex-col gap-1">
        <p
          className={`text-[17px] font-bold ${cheaper ? "text-brand" : "text-ink"}`}
        >
          {headline}
        </p>

        {canCompare && (
          <>
            <p className="text-xs text-muted">
              {comparedCount}개의 동일한 상품 기준이에요.
            </p>
            {excluded.length > 0 && (
              <p className="text-xs text-muted">
                비교에서 뺀 상품:{" "}
                {excluded
                  .map((item) => describeExcluded(item, labels))
                  .join(", ")}
              </p>
            )}
            <div className="flex gap-4 text-[13px]">
              {MART_SLOTS.map((mart) => (
                <span
                  key={mart}
                  className={mart === cheaper ? "text-brand" : "text-muted"}
                >
                  {labels[mart]}{" "}
                  <span className="font-semibold tabular-nums">
                    {formatPrice(totals[mart])}
                  </span>
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <ConfirmListButton comparison={comparison} surveyedAt={surveyedAt} />
    </section>
  );
}

function describeExcluded(
  { name, missingMarts }: ExcludedItem,
  labels: Record<MartSlot, string>,
) {
  if (missingMarts.length === MART_SLOTS.length)
    return `${name} (가격 정보 없음)`;
  const marts = missingMarts.map((mart) => labels[mart]).join(", ");
  return `${name} (${marts} 가격 없음)`;
}
