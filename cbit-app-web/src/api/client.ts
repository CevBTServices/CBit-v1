import type { Haber, Proje, IsOrtagi } from "../types";

// Eğer VITE_API_URL tanımlıysa onu kullan, yoksa yerel localhost'a düş.
// Değer sadece "/api" ise, fetch fonksiyonu bunu otomatik olarak mevcut domainin arkasına ekler.
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4101";

async function request<T>(
  path: string,
  options?: { method?: string; body?: Record<string, unknown> },
): Promise<T> {
  // URL'i oluştururken çift eğik çizgi (//) oluşmaması için küçük bir temizlik yapıyoruz
  const cleanBase = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `${cleanBase}${cleanPath}`;

  const res = await fetch(fullUrl, {
    method: options?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json", // Sunucuya JSON beklediğimizi açıkça söylüyoruz
    },
    // POST isteklerinde body'yi stringify edip gönderiyoruz
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "İstek başarısız");
  }

  const text = await res.text();
  if (!text || text === "OK") return undefined as T;
  try {
    return JSON.parse(text);
  } catch {
    return undefined as T;
  }
}

export const api = {
  projeler: {
    list: () => request<Proje[]>("/v1/projects/our-projects"),
    get: (id: string) => request<Proje>(`/v1/projects/find/${id}`),
  },
  haberler: {
    list: () => request<Haber[]>("/v1/news/our-news"),
    get: (id: string) => request<Haber>(`/v1/news/find/${id}`),
  },
  messages: {
    create: (data: {
      adSoyad: string;
      eposta: string;
      konu: string;
      mesaj: string;
    }) =>
      request<Record<string, unknown>>("/v1/messages", {
        method: "POST",
        body: data,
      }),
  },
  isortaklari: {
    list: () => request<IsOrtagi[]>("/v1/isortaklari"),
    delete: (id: string) => request<Record<string, unknown>>(`/v1/isortaklari/${id}`, { method: "DELETE" }),
    create: async (formData: FormData) => {
      const fullUrl = `${API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE}/v1/isortaklari`;
      const res = await fetch(fullUrl, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("İstek başarısız");
      return res.json();
    },
    update: async (id: string, formData: FormData) => {
      const fullUrl = `${API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE}/v1/isortaklari/${id}`;
      const res = await fetch(fullUrl, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("İstek başarısız");
      return res.json();
    },
  },
};
