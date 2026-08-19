import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface CookiePreferences {
  kisiselVeriler: boolean;
  cerezPolitikasi: boolean;
}

interface CookieContextValue {
  hasConsented: boolean;
  preferences: CookiePreferences;
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (prefs: CookiePreferences) => void;
}

const defaultPreferences: CookiePreferences = {
  kisiselVeriler: true,
  cerezPolitikasi: true,
};

const CookieContext = createContext<CookieContextValue | undefined>(undefined);

const CONSENT_KEY = "cbit_cookie_consent";

export function CookieProvider({ children }: { children: ReactNode }) {
  const [hasConsented, setHasConsented] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHasConsented(true);
        setPreferences(parsed);
      } catch (e) {
        // Parse error
      }
    }
  }, []);

  const persist = (prefs: CookiePreferences) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setHasConsented(true);
    setModalOpen(false);
  };

  const clearAllCookies = () => {
    const cookies = document.cookie.split("; ");
    for (let c = 0; c < cookies.length; c++) {
      const d = window.location.hostname.split(".");
      while (d.length > 0) {
        const cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
        const p = location.pathname.split('/');
        document.cookie = cookieBase + '/';
        while (p.length > 0) {
          document.cookie = cookieBase + p.join('/');
          p.pop();
        }
        d.shift();
      }
    }
  };

  const acceptAll = () => {
    persist({ kisiselVeriler: true, cerezPolitikasi: true });
  };

  const rejectAll = () => {
    persist({ kisiselVeriler: true, cerezPolitikasi: false });
    clearAllCookies();
  };

  const savePreferences = (prefs: CookiePreferences) => {
    persist(prefs);
    if (!prefs.kisiselVeriler && !prefs.cerezPolitikasi) {
      clearAllCookies();
    }
  };

  return (
    <CookieContext.Provider
      value={{
        hasConsented,
        preferences,
        isModalOpen,
        setModalOpen,
        acceptAll,
        rejectAll,
        savePreferences,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
}

export function useCookies() {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error("useCookies must be used within a CookieProvider");
  }
  return context;
}
