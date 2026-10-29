import { findSurveyDays } from "@/lib/kca/survey-day";

// 확인이 끝나면 지울 임시 파일
export async function GET() {
  const started = performance.now();
  const { current, previous } = await findSurveyDays("946");

  return Response.json({
    elapsedMs: Math.round(performance.now() - started),
    current: current && { day: current.day, count: current.prices.length },
    previous: previous && { day: previous.day, count: previous.prices.length },
  });
}
