"use client";

import Link from "next/link";
import { useListStore } from "@/stores/list-store-provider";
import { ListCard } from "@/components/list-card";

export default function ListsPage() {
  const lists = useListStore((s) => s.lists);
  const hasHydrated = useListStore((s) => s.hasHydrated);

  return (
    <div>
      <header className="flex items-center justify-between border-b border-line bg-white px-5 py-4">
        <h1 className="text-[22px] font-bold tracking-[-0.3px] text-ink">
          내 리스트
        </h1>
        {/* TODO: 히스토리 화면 만들 때 링크 추가 */}
      </header>

      <div className="px-4 pt-3.5 pb-6">
        {!hasHydrated ? (
          <div className="flex flex-col gap-3">
            <div className="h-[220px] animate-pulse rounded-2xl bg-white" />
            <div className="h-[220px] animate-pulse rounded-2xl bg-white" />
          </div>
        ) : lists.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex flex-col gap-1">
              <p className="text-[15px] font-semibold text-ink">
                확정한 리스트가 없어요.
              </p>
              <p className="text-[13px] text-muted">
                장바구니에서 리스트를 확정하면 여기에 모여요.
              </p>
            </div>
            <Link
              href="/"
              className="flex min-h-11 items-center rounded-xl border border-line bg-white px-4 text-sm font-medium text-brand"
            >
              장바구니로 가기
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-3">
              {lists.map((list) => (
                <ListCard key={list.id} list={list} />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
