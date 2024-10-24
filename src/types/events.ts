import { EventVisibilities } from "../enums/EventVisibilities";

export interface Event {
  link: string;
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  visibility: EventVisibilities;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
