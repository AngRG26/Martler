import Link from "next/link";

export default function SearchPage() {
  return (
    <div className="p-5">
      <Link href="/" className="text-brand">
        ← 장바구니로
      </Link>
      <h1 className="mt-4 text-[22px] font-bold">상품 검색</h1>
    </div>
  );
}
