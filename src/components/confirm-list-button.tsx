"use client"; // 클릭과 store, router를 쓰니까 클라이언트 컴포넌트

import { useRouter } from "next/navigation"; // 코드로 페이지 이동 (App Router용)
import { useCartStore } from "@/stores/cart-store-provider"; // 장바구니
import { useListStore } from "@/stores/list-store-provider"; // 리스트
import { useMartStore } from "@/stores/mart-store-provider"; // 내 매장
import { createShoppingList } from "@/lib/list"; // 리스트 만들기
import type { CartChange } from "@/lib/price-change"; // 전체 변동 타입

/** 확정 버튼의 props (함수 없이 데이터만 받아요) */
type ConfirmListButtonProps = {
  /** 장바구니 전체 변동 */
  change: CartChange;
  /** 이번 조사일 */
  surveyedAt: string;
  /** 지난 조사일. 못 찾았으면 null */
  previousSurveyedAt: string | null;
};

/**
 * "리스트 확정" 버튼.
 * 누르면 리스트를 만들어 저장하고 → 장바구니를 비우고 → 내 리스트로 이동해요.
 */
export function ConfirmListButton({
  change,
  surveyedAt,
  previousSurveyedAt,
}: ConfirmListButtonProps) {
  const router = useRouter(); // 페이지 이동용
  const items = useCartStore((s) => s.items); // 지금 장바구니 상품들
  const clear = useCartStore((s) => s.clear); // 장바구니 비우기
  const addList = useListStore((s) => s.addList); // 리스트 저장
  const mart = useMartStore((s) => s.marts.home); // 지금 고른 내 매장 (ID + 이름)

  /** 버튼을 눌렀을 때 */
  const handleConfirm = () => {
    if (items.length === 0) return; // 빈 장바구니는 확정하지 않아요
    // 리스트 만들어서 저장 (이름 붙은 객체로 넘겨요)
    addList(
      createShoppingList({
        items,
        change,
        surveyedAt,
        previousSurveyedAt,
        mart,
      }),
    );
    clear(); // 장바구니 비우기
    router.push("/lists"); // 내 리스트 화면으로
  };

  return (
    <button
      type="button" // 폼 제출 버튼이 아님
      onClick={handleConfirm} // 누르면 위 함수 실행
      className="mt-2 min-h-[52px] rounded-xl bg-brand text-base font-semibold text-white" // 위 문구와 간격, 큰 파란 버튼
    >
      리스트 확정
    </button>
  );
}
