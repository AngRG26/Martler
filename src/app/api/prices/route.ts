import type { NextRequest } from "next/server";
import { getPriceSnapshot } from "@/lib/kca/price-snapshot";

// GET /api/prices?home=946&rival=10
export async function GET(request: NextRequest) {
  // 주소 뒤의 ?home=...&rival=... 값을 꺼내요
  const home = request.nextUrl.searchParams.get("home");
  const rival = request.nextUrl.searchParams.get("rival");

  // 매장 ID는 숫자뿐이어야 해요. 이상한 값이 공공데이터 API까지 가지 않게 여기서 막아요
  const isValidId = (id: string | null): id is string =>
    !!id && /^\d+$/.test(id);
  if (!isValidId(home) || !isValidId(rival)) {
    return Response.json(
      { error: "home, rival 매장 ID가 필요해요" },
      { status: 400 },
    );
  }

  const snapshot = await getPriceSnapshot(home, rival);
  if (!snapshot) {
    return Response.json(
      { error: "최근 8주 동안 가격 데이터가 없어요" },
      { status: 404 },
    );
  }

  return Response.json(snapshot);
}
