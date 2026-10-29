import "server-only";
import { XMLParser } from "fast-xml-parser";

const BASE_URL = "https://apis.data.go.kr/B551919/ProductPriceInfoService";

const parser = new XMLParser({
  // 모든 값을 문자열 그대로 둬요. 숫자 변환은 우리가 직접 해요.
  parseTagValue: false,
  // 이 태그들은 하나뿐이어도 항상 배열로 만들어요.
  isArray: (tagName) =>
    tagName.startsWith("iros.openapi.service.vo.") || tagName === "item",
});

function getServiceKey() {
  const key = process.env.DATA_GO_KR_SERVICE_KEY;
  if (!key) throw new Error(".env.local에 DATA_GO_KR_SERVICE_KEY가 없어요");
  return key;
}

async function requestKca<T>(
  path: string,
  params: Record<string, string>,
): Promise<T[]> {
  const url = new URL(BASE_URL + path);
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, value);
  }

  const res = await fetch(url, { next: { revalidate: 60 * 60 * 6 } }); // 6시간
  if (!res.ok) throw new Error(`참가격 API 응답 오류: HTTP ${res.status}`);

  const xml = await res.text();
  const data = parser.parse(xml);

  // 키 오류 같은 경우는 <response>가 아닌 다른 모양의 XML이 와요
  const response = data.response;
  if (!response) throw new Error(`참가격 API 오류 응답: ${xml.slice(0, 200)}`);
  if (response.resultCode !== "00") {
    throw new Error(
      `참가격 API 오류: ${response.resultCode} ${response.resultMsg}`,
    );
  }

  // 결과가 없으면 <result/>가 빈 문자열로 와요
  const result = response.result;
  if (!result || typeof result !== "object") return [];

  // result 안의 배열 하나(…VO 또는 item)를 꺼내요
  const list = Object.values(result).find(Array.isArray);
  return (list ?? []) as T[];
}

// ----- API 응답 모양 (모든 값이 문자열) -----

export type KcaPrice = {
  goodInspectDay: string;
  entpId: string;
  goodId: string;
  goodPrice: string;
  plusoneYn?: string;
  goodDcYn?: string;
  goodDcStartDay?: string;
  goodDcEndDay?: string;
  inputDttm?: string;
};

export type KcaStore = {
  entpId: string;
  entpName: string;
  entpTypeCode: string;
  entpAreaCode: string;
  areaDetailCode: string;
  roadAddrBasic?: string;
};

export type KcaProduct = {
  goodId: string;
  goodName: string;
  goodSmlclsCode?: string;
  goodTotalCnt?: string;
  goodTotalDivCode?: string;
};

// ----- 기능별 함수 -----

// 매장 하나의 조사일 가격 전체
export function fetchStorePrices(entpId: string, inspectDay: string) {
  return requestKca<KcaPrice>("/getProductPriceInfoSvc", {
    serviceKey: getServiceKey(), // 가격만 소문자 s
    goodInspectDay: inspectDay,
    entpId,
  });
}

// 판매점 전체 목록
export function fetchStores() {
  return requestKca<KcaStore>("/getStoreInfoSvc.do", {
    ServiceKey: getServiceKey(), // 나머지는 대문자 S
  });
}

// 상품 하나 (goodId 없이 부르면 전체 목록일 수 있어요. 3단계에서 확인)
export function fetchProduct(goodId: string) {
  return requestKca<KcaProduct>("/getProductInfoSvc.do", {
    ServiceKey: getServiceKey(),
    goodId,
  });
}
