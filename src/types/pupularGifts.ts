import { Event } from "./events";

export type PopularGift = {
  id: string;
  name: string;
  description: string;
  image: string;
  userId: string;
  currency: string;
  price: string;
  link: string;
  reservedEmail: string;
  createdAt: string;
  updatedAt: string;
  eventId: string;
  popularity: number;
  event: Event;
  originalPrice: string;
  originalCurrency: string;
};
