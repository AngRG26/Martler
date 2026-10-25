"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store-provider";
import { useListStore } from "@/stores/list-store-provider";
import { createShoppingList } from "@/lib/list";
import type { CartComparison } from "@/lib/price";

type ConfirmListButtonProps = {
  comparison: CartComparison;
  surveyedAt: string;
};

export function ConfirmListButton({
  comparison,
  surveyedAt,
}: ConfirmListButtonProps) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const addList = useListStore((s) => s.addList);

  const handleConfirm = () => {
    if (items.length === 0) return;
    addList(createShoppingList(items, comparison, surveyedAt));
    clear();
    router.push("/lists");
  };

  return (
    <button
      type="button"
      onClick={handleConfirm}
      className="min-h-[52px] rounded-xl bg-brand text-base font-semibold text-white"
    >
      리스트 확정
    </button>
  );
}
