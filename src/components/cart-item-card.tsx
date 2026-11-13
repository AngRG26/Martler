"use client"; // 수량 버튼(onClick)과 store를 쓰니까 클라이언트 컴포넌트

import type { CartItem } from "@/types/cart"; // 장바구니 아이템 타입 (이름, 수량)
import type { ProductPrice } from "@/types/snapshot"; // 서버에서 받은 상품 가격 타입
import { formatPrice, formatSurveyDate } from "@/lib/price"; // "2,980원", "10월 23일" 만들기
import { getPriceChange, type PriceChange } from "@/lib/price-change"; // 이번/지난 조사 비교
import { useCartStore } from "@/stores/cart-store-provider"; // 수량 바꾸기, 빼기 함수
import { ChangeArrow } from "./change-arrow"; // 위/아래 화살표 아이콘

/** 장바구니 상품 카드의 props */
type CartItemCardProps = {
  /** 장바구니 아이템 (상품 ID, 이름, 수량) */
  item: CartItem;
  /** 서버에서 받은 이 상품의 가격. 이 매장 데이터에 없는 상품이면 undefined */
  product: ProductPrice | undefined;
  /** 가격을 아직 불러오는 중인지 */
  isPriceLoading: boolean;
  /** 내 매장의 짧은 이름 (예: '천호점') */
  martName: string;
  /** 지난 조사일 'YYYY-MM-DD'. 못 찾았으면 null */
  previousSurveyedAt: string | null;
};

/**
 * 장바구니 상품 하나.
 * 위쪽은 이름과 수량 조절, 아래쪽은 내 매장 가격과 지난 조사 대비 변동이에요.
 */
export function CartItemCard({
  item, // 장바구니 아이템
  product, // 가격 정보 (없을 수 있음)
  isPriceLoading, // 로딩 중인지
  martName, // 매장 이름
  previousSurveyedAt, // 지난 조사일
}: CartItemCardProps) {
  // 수량 바꾸기 함수 (store가 만들어질 때 한 번 생기고 안 바뀌어서 다시 그리기를 일으키지 않아요)
  const changeQuantity = useCartStore((s) => s.changeQuantity);
  // 상품 빼기 함수
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    // 카드 전체: 흰 배경, 둥근 모서리, 위아래로 쌓기
    <li className="flex flex-col gap-3 rounded-[14px] bg-white p-3.5 shadow-[0_1px_2px_rgba(15,27,45,0.06)]">
      {/* 위쪽 줄: 상품 이름(왼쪽) + 수량 조절(오른쪽) */}
      <div className="flex items-center justify-between gap-3">
        {/* 이름이 길면 한 줄로 자르고 … 표시 (min-w-0이 있어야 truncate가 동작해요) */}
        <span className="min-w-0 truncate text-[15px] font-semibold text-ink">
          {item.name}
        </span>

        {/* 수량 조절 묶음: 테두리 안에 [−] 숫자 [+] */}
        <div className="flex shrink-0 items-center rounded-[10px] border border-line">
          {/* 수량이 1이면 − 대신 휴지통(빼기), 2 이상이면 − (줄이기) */}
          {item.quantity === 1 ? (
            <button
              type="button" // 폼 제출 버튼이 아님을 명시
              aria-label={`${item.name} 삭제`} // 아이콘만 있어서 무슨 버튼인지 글로 알려줘요
              onClick={() => removeItem(item.productId)} // 누르면 장바구니에서 빼기
              className="flex size-10 items-center justify-center text-muted" // 40px 정사각형
            >
              <TrashIcon />
            </button>
          ) : (
            <button
              type="button" // 폼 제출 버튼이 아님
              aria-label="수량 줄이기" // 화면 낭독기용 이름
              onClick={() => changeQuantity(item.productId, -1)} // 수량 1 줄이기
              className="size-10 text-lg text-ink" // 40px 정사각형
            >
              −
            </button>
          )}
          {/* 현재 수량. tabular-nums는 숫자 폭을 같게 해서 바뀔 때 흔들리지 않게 */}
          <span className="min-w-6 text-center text-[15px] font-semibold tabular-nums text-ink">
            {item.quantity}
          </span>
          <button
            type="button" // 폼 제출 버튼이 아님
            aria-label="수량 늘리기" // 화면 낭독기용 이름
            onClick={() => changeQuantity(item.productId, 1)} // 수량 1 늘리기
            className="size-10 text-lg text-ink" // 40px 정사각형
          >
            +
          </button>
        </div>
      </div>

      {/* 아래쪽: 가격 영역. 상황(로딩, 조사 안 함, 이번 조사 없음, 정상)에 따라 달라져요 */}
      <PriceArea
        product={product} // 가격 정보
        isPriceLoading={isPriceLoading} // 로딩 중인지
        martName={martName} // 매장 이름
        previousSurveyedAt={previousSurveyedAt} // 지난 조사일
      />
    </li>
  );
}

/**
 * 카드 아래쪽 가격 영역.
 * 다섯 가지 경우를 위에서부터 차례로 확인해서, 맞는 경우를 찾으면 바로 그려요.
 */
function PriceArea({
  product, // 가격 정보
  isPriceLoading, // 로딩 중인지
  martName, // 매장 이름
  previousSurveyedAt, // 지난 조사일
}: Omit<CartItemCardProps, "item">) {
  // ① 가격을 받는 중이면 회색 막대(스켈레톤)
  if (isPriceLoading)
    return <div className="h-12 animate-pulse rounded-lg bg-canvas" />;

  // ② 이 매장 데이터에 아예 없는 상품 (이 매장에서 조사하지 않음)
  if (!product) {
    return (
      <p className="text-[13px] text-muted">
        {martName}에서 조사하지 않는 상품이에요
      </p>
    );
  }

  // 지난 조사 문구: "지난 조사(10월 23일) 3,280원". 지난 가격이나 날짜가 없으면 null
  const previousText =
    product.previousPrice !== undefined && previousSurveyedAt // 둘 다 있을 때만
      ? `지난 조사(${formatSurveyDate(previousSurveyedAt)}) ${formatPrice(product.previousPrice)}`
      : null;

  // ③ 이번 조사에서 빠진 상품 (지난 가격만 있음, 예: 우유 224)
  if (!product.current) {
    return (
      <div className="flex flex-col gap-0.5">
        {/* 큰 가격 자리에 안내 문구 */}
        <span className="text-[15px] font-semibold text-muted">
          이번 조사에는 없어요
        </span>
        {/* 마지막으로 알던 가격 */}
        {previousText && (
          <span className="text-xs text-muted">{previousText}</span>
        )}
      </div>
    );
  }

  // 여기부터는 이번 가격이 확실히 있어요 (③에서 걸러졌으니까)
  // 이번/지난 비교 결과: changed, same, new 중 하나
  const change = getPriceChange(product);

  // ④ 정상: 매장 이름 → 이번 가격(크게) + 배지들 → 지난 가격(작게)
  return (
    <div className="flex flex-col gap-0.5">
      {/* 어느 매장 가격인지 */}
      <span className="text-xs text-muted">{martName}</span>
      {/* 가격과 배지를 한 줄에. 폭이 좁으면 배지가 다음 줄로 (flex-wrap) */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 이번 조사 가격 (가장 크게) */}
        <span className="text-[22px] font-bold tabular-nums text-ink">
          {formatPrice(product.current.price)}
        </span>
        {/* 변동 배지 (오름/내림/변동 없음/처음 조사) */}
        {change && <ChangeBadge change={change} />}
        {/* 할인 중이면 배지 */}
        {product.current.isSale && <span className={SALE_BADGE}>할인</span>}
        {/* 1+1이면 배지 */}
        {product.current.isOnePlusOne && (
          <span className={SALE_BADGE}>1+1</span>
        )}
      </div>
      {/* 지난 조사 가격 (근거) */}
      {previousText && (
        <span className="text-xs text-muted">{previousText}</span>
      )}
    </div>
  );
}

/** 회색 배지 스타일 (변동 없음, 처음 조사) */
const GRAY_BADGE =
  "rounded-md border border-line bg-canvas px-2 py-0.5 text-xs text-muted";

/** 할인, 1+1 배지 스타일 */
const SALE_BADGE =
  "rounded bg-sale-soft px-1.5 py-0.5 text-[11px] font-semibold text-sale";

/** ChangeBadge의 props */
type ChangeBadgeProps = {
  /** getPriceChange의 결과 */
  change: PriceChange;
};

/**
 * 지난 조사 대비 변동 배지.
 * 오름은 빨강 + 위 화살표, 내림은 파랑 + 아래 화살표. 색만으로 구분하지 않게 글자도 같이 써요.
 */
function ChangeBadge({ change }: ChangeBadgeProps) {
  // 이번에 처음 조사된 상품
  if (change.kind === "new")
    return <span className={GRAY_BADGE}>이번에 처음 조사</span>;
  // 지난 조사와 같은 가격
  if (change.kind === "same")
    return <span className={GRAY_BADGE}>변동 없음</span>;
  // 빠진 상품은 PriceArea ③에서 따로 그려서 여기 올 일이 없어요
  if (change.kind === "missing") return null;

  // 여기서 change는 'changed'로 좁혀져서 change.diff를 쓸 수 있어요
  const isUp = change.diff > 0; // 0보다 크면 오름

  return (
    // 오름은 빨강 계열, 내림은 파랑 계열 배경
    <span
      className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
        isUp ? "bg-danger/10 text-danger" : "bg-brand-soft text-brand"
      }`}
    >
      {/* 방향 화살표 */}
      <ChangeArrow up={isUp} />
      {/* 금액은 부호 없이 (Math.abs), 방향은 글자로 */}
      {formatPrice(Math.abs(change.diff))} {isUp ? "오름" : "내림"}
    </span>
  );
}

/** 휴지통 아이콘 (수량이 1일 때 빼기 버튼) */
function TrashIcon() {
  return (
    <svg
      width="18" // 가로 18px
      height="18" // 세로 18px
      viewBox="0 0 24 24" // path 좌표 기준
      fill="none" // 안쪽 비움
      stroke="currentColor" // 선 색은 버튼 글자색
      strokeWidth="2" // 선 굵기
      strokeLinecap="round" // 선 끝 둥글게
      strokeLinejoin="round" // 꺾이는 곳 둥글게
      aria-hidden="true" // 버튼의 aria-label이 대신 설명해요
    >
      {/* 뚜껑, 몸통, 세로줄 두 개 */}
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </svg>
  );
}
