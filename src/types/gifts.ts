import { PopularGift } from "./pupularGifts";

export interface Gift {
  giftCount: number;
  giftReservedCount: number;
  meta: Meta;
  data: PopularGift[];
}

export interface Meta {
  page: number;
  limit: number;
  totalPages: number;
  totalGifts: number;
}
