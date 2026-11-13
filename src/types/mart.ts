/** 사용자가 고른 내 이마트 지점 */
export type SelectedMart = {
  /** 참가격 매장 ID (예: '946'). 가격을 요청할 때 써요 */
  entpId: string;
  /** API의 매장 이름 그대로 (예: '이마트천호점') */
  name: string;
};
