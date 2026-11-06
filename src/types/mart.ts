import type { MartSlot } from "./price";

export type SelectedMart = {
  entpId: string; // '946'
  name: string; // '이마트천호점' (API의 entpName 그대로)
};

export type SelectedMarts = Record<MartSlot, SelectedMart>;
