import { createContext } from "react";
import { tr } from "../i18n/tr";
import type { Translations } from "../i18n/tr";

export type Lang = "tr" | "en";

export interface LanguageContextType {
  lang: Lang;
  t: Translations;
  setLang: (l: Lang) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: "tr",
  t: tr,
  setLang: () => {},
});
