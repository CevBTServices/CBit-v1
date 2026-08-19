import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface SiteAyarlari {
  projelerAktif: boolean;
  haberlerAktif: boolean;
  isOrtaklariAktif: boolean;
}

interface SiteAyarlariContextValue {
  ayarlar: SiteAyarlari;
  loading: boolean;
}

const defaultAyarlar: SiteAyarlari = {
  projelerAktif: false,
  haberlerAktif: true,
  isOrtaklariAktif: true,
};

const SiteAyarlariContext = createContext<SiteAyarlariContextValue>({
  ayarlar: defaultAyarlar,
  loading: true,
});

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4101';

export function SiteAyarlariProvider({ children }: { children: ReactNode }) {
  const [ayarlar, setAyarlar] = useState<SiteAyarlari>(defaultAyarlar);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/v1/ayarlar/site`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Ayarlar alınamadı');
        return res.json();
      })
      .then((data: SiteAyarlari) => setAyarlar(data))
      .catch(() => {
        // Fetch başarısız olursa güvenli varsayılan: projeler kapalı
        setAyarlar(defaultAyarlar);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteAyarlariContext.Provider value={{ ayarlar, loading }}>
      {children}
    </SiteAyarlariContext.Provider>
  );
}

export function useSiteAyarlari() {
  return useContext(SiteAyarlariContext);
}
