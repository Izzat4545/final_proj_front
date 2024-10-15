import { Events } from "vue";

export type PopularGifts = {
  id: string;
  name: string;
  description: string;
  image: string;
  userId: string;
  currency: string;
  price: string;
  link: string;
  reservedEmail: null;
  createdAt: string;
  updatedAt: string;
  eventId: string;
  event: Events;
  originalPrice: string;
  originalCurrency: string;
};
