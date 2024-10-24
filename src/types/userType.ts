import { Currencies } from "../enums/Currencies";

export interface UserType {
  id: string;
  name: string;
  email: string;
  currency: Currencies;
}
