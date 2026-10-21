import { MARTS, MART_LABEL } from "@/types/price";
import {
  formatPrice,
  type CartComparison,
  type ExcludedItem,
} from "@/lib/price";

type CartSummaryBarProps = {
  comparison: CartComparison;
};

export function CartSummaryBar({ comparison }: CartSummaryBarProps) {
  const { totals, comparedCount, excluded, cheaperMarts, difference } =
    comparison;
  const canCompare = comparedCount > 0;
  const cheaper = cheaperMarts.length === 1 ? cheaperMarts[0] : null;

  let headline: string;
  if (!canCompare) {
    headline = "비교할 수 있는 상품이 없어요";
  } else if (cheaper) {
    headline = `${MART_LABEL[cheaper]}가 ${formatPrice(difference)} 더 저렴해요.`;
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
                비교에서 뺀 상품: {excluded.map(describeExcluded).join(", ")}
              </p>
            )}
            <div className="flex gap-4 text-[13px]">
              {MARTS.map((mart) => (
                <span
                  key={mart}
                  className={mart === cheaper ? "text-brand" : "text-muted"}
                >
                  {MART_LABEL[mart]}{" "}
                  <span className="font-semibold tabular-nums">
                    {formatPrice(totals[mart])}
                  </span>
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* TODO: 내 리스트 만들 때 onClick 연결 */}
      <button
        type="button"
        className="min-h-[52px] rounded-xl bg-brand text-base font-semibold text-white"
      >
        리스트 확정
      </button>
    </section>
  );
}

function describeExcluded({ name, missingMarts }: ExcludedItem) {
  // 모든 마트에 없으면 마트 이름 대신 "가격 정보 없음"
  if (missingMarts.length === MARTS.length) return `${name} (가격 정보 없음)`;
  const marts = missingMarts.map((mart) => MART_LABEL[mart]).join(", ");
  return `${name} (${marts}에는 가격정보가 없음)`;
}
