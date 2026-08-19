import { useState, useEffect, type ReactNode } from "react";
import { LanguageContext, type Lang } from "./LanguageContext";
import { tr } from "../i18n/tr";
import { en } from "../i18n/en";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("tr");
  const t = lang === "tr" ? tr : en;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
