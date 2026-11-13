import Link from "next/link"; // 페이지 이동 링크 (새로고침 없이 이동)

/** 장바구니 헤더의 props */
type CartHeaderProps = {
  /** 장바구니 상품 수. 아직 복원 전이면 null (0개로 깜빡이지 않게 숨겨요) */
  itemCount: number | null;
  /** 내 매장 짧은 이름 (예: '천호점') */
  martName: string;
};

/**
 * 장바구니 화면 위쪽 헤더.
 * 제목과 상품 수, 내 매장(누르면 매장 설정), 검색창(누르면 검색 화면)이 있어요.
 * (클릭은 Link가 처리하고 store를 안 써서 'use client'가 필요 없어요)
 */
export function CartHeader({ itemCount, martName }: CartHeaderProps) {
  return (
    // 흰 배경, 아래 테두리, 세 줄을 위아래로 쌓기
    <header className="flex flex-col gap-3 border-b border-line bg-white px-5 pt-4 pb-3">
      {/* 첫 줄: 제목(왼쪽) + 상품 수(오른쪽) */}
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold tracking-[-0.3px] text-ink">
          장바구니
        </h1>
        {/* 복원 전(null)에는 아무것도 안 보여줘요 */}
        {itemCount !== null && (
          <span className="text-[13px] text-muted">{itemCount}개 상품</span>
        )}
      </div>

      {/* 둘째 줄: 내 매장. 누르면 매장 설정 화면으로 */}
      <Link
        href="/mart" // 매장 설정 화면 주소
        className="flex min-h-11 items-center gap-2 rounded-[10px] bg-brand-soft px-3 text-sm text-brand" // 연한 파란 배경 버튼 모양
      >
        <PinIcon />
        {/* 매장 이름 (남는 폭을 다 차지해서 "변경"을 오른쪽 끝으로 밀어요) */}
        <span className="grow font-medium">이마트 {martName}</span>
        {/* 오른쪽 끝 안내 글자 */}
        <span className="text-[13px]">변경</span>
      </Link>

      {/* 셋째 줄: 검색창 모양의 링크. 실제 입력은 검색 화면에서 */}
      <Link
        href="/search" // 검색 화면 주소
        className="flex min-h-12 items-center gap-2 rounded-xl border border-line bg-canvas px-3.5 text-[15px] text-muted" // 입력창처럼 보이게
      >
        <SearchIcon />
        상품 검색 (예: 우유, 두부)
      </Link>
    </header>
  );
}

/** 위치 핀 아이콘 (매장 버튼) */
function PinIcon() {
  return (
    <svg
      width="18" // 가로 18px
      height="18" // 세로 18px
      viewBox="0 0 24 24" // path 좌표 기준
      fill="none" // 안쪽 비움
      stroke="currentColor" // 선 색은 글자색(파랑)
      strokeWidth="2" // 선 굵기
      strokeLinecap="round" // 선 끝 둥글게
      strokeLinejoin="round" // 꺾이는 곳 둥글게
      aria-hidden="true" // 옆 글자가 설명하니까 화면 낭독기에서 숨김
    >
      {/* 핀 모양 */}
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      {/* 핀 가운데 동그라미 */}
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

/** 돋보기 아이콘 (검색창) */
function SearchIcon() {
  return (
    <svg
      width="20" // 가로 20px
      height="20" // 세로 20px
      viewBox="0 0 24 24" // path 좌표 기준
      fill="none" // 안쪽 비움
      stroke="currentColor" // 선 색은 글자색(회색)
      strokeWidth="2" // 선 굵기
      strokeLinecap="round" // 선 끝 둥글게
      aria-hidden="true" // 장식용
    >
      {/* 렌즈 */}
      <circle cx="11" cy="11" r="7" />
      {/* 손잡이 */}
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
