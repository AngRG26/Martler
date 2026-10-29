import "server-only";
import { fetchStorePrices, type KcaPrice } from "./client";

const MAX_FRIDAYS = 8; // 최대 8주 전까지만 찾아요

// 한국 날짜 기준으로 최근 금요일들을 'YYYYMMDD'로
function recentFridays(now: Date, count: number): string[] {
  const koreaToday = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(now);
  const [year, month, day] = koreaToday.split("-").map(Number);
  const today = new Date(Date.UTC(year, month - 1, day));

  const daysSinceFriday = (today.getUTCDay() - 5 + 7) % 7; // 금요일 = 5

  const fridays: string[] = [];
  for (let i = 0; i < count; i++) {
    const friday = new Date(today);
    friday.setUTCDate(today.getUTCDate() - daysSinceFriday - i * 7);
    fridays.push(friday.toISOString().slice(0, 10).replaceAll("-", ""));
  }
  return fridays;
}

export type SurveyPrices = {
  day: string; // 'YYYYMMDD'
  prices: KcaPrice[];
};

// 데이터가 있는 금요일을 최신순으로 두 개 찾아요
export async function findSurveyDays(entpId: string, now: Date = new Date()) {
  const found: SurveyPrices[] = [];

  for (const day of recentFridays(now, MAX_FRIDAYS)) {
    const prices = await fetchStorePrices(entpId, day);
    if (prices.length > 0) found.push({ day, prices });
    if (found.length === 2) break;
  }

  return {
    current: found[0] ?? null, // 이번 조사
    previous: found[1] ?? null, // 지난 조사
  };
}
