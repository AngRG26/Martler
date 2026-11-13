/** 원화 숫자 형식 (지역을 고정해서 서버와 브라우저 결과가 같게) */
const krw = new Intl.NumberFormat("ko-KR");

/**
 * 숫자를 "2,980원" 모양으로.
 * @example formatPrice(2980) // "2,980원"
 */
export function formatPrice(price: number) {
  return `${krw.format(price)}원`; // 쉼표 넣고 "원" 붙이기
}

/**
 * 조사일 'YYYY-MM-DD'를 "M월 D일"로.
 * new Date를 쓰면 시간대 때문에 하루가 밀릴 수 있어서 글자를 직접 잘라요.
 * @example formatSurveyDate('2026-11-06') // "11월 6일"
 */
export function formatSurveyDate(date: string) {
  const [, month, day] = date.split("-").map(Number); // ['2026','11','06'] → [2026, 11, 6], 연도는 건너뛰기
  return `${month}월 ${day}일`; // "11월 6일"
}
