import { PopularGift } from "./pupularGifts";

export interface Gift {
  giftCount: number;
  giftReservedCount: number;
  gifts: PopularGift[];
}
