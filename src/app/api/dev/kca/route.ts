import { fetchStorePrices } from "@/lib/kca/client";

// 확인이 끝나면 지울 임시 파일
export async function GET() {
  const prices = await fetchStorePrices("946", "20261009");
  return Response.json({
    count: prices.length,
    sample: prices.slice(0, 3),
  });
}
