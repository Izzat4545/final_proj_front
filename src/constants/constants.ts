import { Currencies } from "../enums/Currencies";
import { GiftCategories } from "../enums/GiftCategories";

const DEFAULT_CATEGORY = "Select category";
export const CATEGORIES = [
  { label: DEFAULT_CATEGORY, value: DEFAULT_CATEGORY },
  { label: "Family", value: GiftCategories.FAMILY },
  { label: "IT", value: GiftCategories.IT },
  { label: "Kids", value: GiftCategories.KIDS },
  { label: "Luxury", value: GiftCategories.LUXURY },
  { label: "Pets", value: GiftCategories.PETS },
];

export const CURRENCY_OPTIONS = [
  { label: Currencies.RUB, value: Currencies.RUB },
  { label: Currencies.USD, value: Currencies.USD },
  { label: Currencies.UZS, value: Currencies.UZS },
];
