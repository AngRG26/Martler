import Link from "next/link"; // 뒤로 가기 링크

/**
 * 내 매장 설정 화면 ('/mart').
 * 하단 탭이 없는 화면이라 (tabs) 그룹 밖에 있어요.
 * 지점 목록은 6-3에서 채워요.
 */
export default function MartSettingsPage() {
  return (
    // (tabs) 밖이라 layout의 <main>을 받지 않아서 직접 <main>을 둬요
    <main className="min-h-dvh">
      {/* 헤더: 뒤로 가기 + 제목 */}
      <header className="flex items-center gap-1 border-b border-line bg-white px-2 py-2">
        <Link
          href="/" // 장바구니로 돌아가기
          aria-label="장바구니로 돌아가기" // 아이콘만 있어서 글로 설명
          className="flex size-11 items-center justify-center text-ink" // 44px 터치 영역
        >
          {/* 왼쪽 꺾쇠 화살표 */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        {/* 화면 제목 */}
        <h1 className="text-lg font-bold text-ink">내 매장 설정</h1>
      </header>

      {/* 임시 안내 (6-3에서 지점 목록으로 바뀌어요) */}
      <p className="px-5 pt-6 text-sm text-muted">
        이마트 지점 목록은 다음 단계에서 만들어요.
      </p>
    </main>
  );
}
