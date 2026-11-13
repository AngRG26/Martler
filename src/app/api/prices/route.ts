import type { NextRequest } from "next/server";
import { getPriceSnapshot } from "@/lib/kca/price-snapshot";

// GET /api/prices?mart=946
export async function GET(request: NextRequest) {
  const mart = request.nextUrl.searchParams.get("mart");

  // 매장 ID는 숫자만 허용해요. 이상한 값이 공공데이터 API까지 가지 않게
  // (if 안에서 바로 검사하니까 5-2의 타입 가드 함수도 필요 없어졌어요.
  //  !mart로 null을 걸러내면 그 아래에서 mart는 string으로 확정돼요)
  if (!mart || !/^\d+$/.test(mart)) {
    return Response.json(
      { error: "mart(매장 ID)가 필요해요" },
      { status: 400 },
    );
  }

  const snapshot = await getPriceSnapshot(mart);
  if (!snapshot) {
    return Response.json(
      { error: "최근 8주 동안 가격 데이터가 없어요" },
      { status: 404 },
    );
  }

  return Response.json(snapshot);
}
