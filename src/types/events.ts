import { EventVisibility } from "../enums/EventVisibility";

export interface Events {
  link: string;
  id: string;
  title: string;
  date: string;
  description: null;
  image: string;
  visibility: EventVisibility;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
