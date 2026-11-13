/** ChangeArrow의 props */
type ChangeArrowProps = {
  /** true면 위 화살표(오름), false면 아래 화살표(내림) */
  up: boolean;
};

/**
 * 가격 변동 방향을 보여주는 작은 화살표 아이콘.
 * 카드의 변동 배지와 하단 바에서 같이 써요.
 */
export function ChangeArrow({ up }: ChangeArrowProps) {
  // 화면 낭독기는 옆에 있는 "오름/내림" 글자를 읽으니 아이콘은 숨겨요(aria-hidden)
  return (
    <svg
      width="12" // 가로 12px
      height="12" // 세로 12px
      viewBox="0 0 24 24" // 아래 path 좌표의 기준 크기
      fill="none" // 안쪽은 비우고
      stroke="currentColor" // 선 색은 부모 글자색을 따라가요 (빨강/파랑)
      strokeWidth="3" // 작은 크기에서도 보이게 굵게
      strokeLinecap="round" // 선 끝을 둥글게
      strokeLinejoin="round" // 꺾이는 곳을 둥글게
      aria-hidden="true" // 장식용이라 화면 낭독기에서 숨김
    >
      {/* up이면 위로 향하는 화살표, 아니면 아래로 향하는 화살표 */}
      {up ? (
        <path d="M12 19V5M5 12l7-7 7 7" />
      ) : (
        <path d="M12 5v14M5 12l7 7 7-7" />
      )}
    </svg>
  );
}
