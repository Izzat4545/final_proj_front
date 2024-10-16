import { Currencies } from "../enums/Currencies";

export interface UserType {
  name: string;
  email: string;
  currency: Currencies;
}
