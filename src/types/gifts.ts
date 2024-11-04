import { PopularGift } from "./pupularGifts";

export interface Gift {
  meta: Meta;
  data: PopularGift[];
}

export interface Meta {
  page: number;
  limit: number;
  totalPages: number;
  totalGifts: number;
}
