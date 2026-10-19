import Link from "next/link";

type CartHeaderProps = {
  itemCount: number | null; // null = 아직 복원 전이라 개수를 모름
};

// 매장 선택 기능은 아직 없어서 임시 고정값
const SELECTED_STORES_LABEL = "이마트 가양점 · 롯데마트 서울역점";

export function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <header className="flex flex-col gap-3 border-b border-line bg-white px-5 pt-4 pb-3">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold tracking-[-0.3px] text-ink">
          장바구니
        </h1>
        {itemCount !== null && (
          <span className="text-[13px] text-muted">{itemCount}개 상품</span>
        )}
      </div>

      {/* TODO: 매장 선택 화면 만들 때 onClick 연결 */}
      <button
        type="button"
        className="flex min-h-11 items-center gap-2 rounded-[10px] bg-brand-soft px-3 text-left text-sm text-brand"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
        <span className="grow font-medium">{SELECTED_STORES_LABEL}</span>
        <span className="text-[13px]">변경</span>
      </button>

      <Link
        href="/search"
        className="flex min-h-12 items-center gap-2 rounded-xl border border-line bg-canvas px-3.5 text-[15px] text-muted"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        상품 검색 (예: 우유, 두부)
      </Link>
    </header>
  );
}
