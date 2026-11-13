// 서버(/api/prices)가 돌려주는 가격 데이터의 모양
// 지점 비교를 뺐으니 "내 매장 하나"의 이번 가격과 지난 가격만 있어요

export type CurrentPrice = {
  price: number; // 이번 조사 가격 (원)
  isSale: boolean; // 할인 중 (API의 goodDcYn === 'Y')
  isOnePlusOne: boolean; // 1+1 (API의 plusoneYn === 'Y')
};

export type ProductPrice = {
  productId: string; // 참가격 goodId
  name: string; // 참가격 goodName
  current?: CurrentPrice; // 이번 조사 가격. 없으면 "이번 조사에서 빠진 상품"
  previousPrice?: number; // 지난 조사 가격. 없으면 "이번에 처음 조사된 상품"
};

export type MartPriceSnapshot = {
  martId: string; // 매장 entpId (예: '946')
  surveyedAt: string; // 이번 조사일 'YYYY-MM-DD'
  previousSurveyedAt: string | null; // 지난 조사일. 못 찾으면 null
  products: Record<string, ProductPrice>; // goodId로 바로 찾을 수 있게
};
