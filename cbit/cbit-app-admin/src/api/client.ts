import type { SiteAyarlari, Proje, Haber, Message, IsOrtagi } from "../types";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4101";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const isFormData = options?.body instanceof FormData;
  const headers = new Headers(options?.headers);
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers,
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "İstek başarısız");
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
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
  auth: {
    login: (data: { username: string; password: string }) =>
      request<void>("/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    logout: () => request<void>("/v1/auth/logout", { method: "POST" }),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      request<void>("/v1/auth/change-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    verify: () =>
      request<{ username: string }>("/v1/auth/verify", { method: "GET" }),
  },

  ayarlar: {
    get: () => request<SiteAyarlari>("/v1/ayarlar/site"),
    update: (data: Partial<Pick<SiteAyarlari, "projelerAktif">>) =>
      request<SiteAyarlari>("/v1/ayarlar/site/update", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  projeler: {
    list: () => request<Proje[]>("/v1/projects/our-projects"),
    get: (id: string) => request<Proje>(`/v1/projects/find/${id}`),
    create: (data: Partial<Proje>) =>
      request<void>("/v1/projects/create", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Proje>) =>
      request<void>(`/v1/projects/update/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/v1/projects/delete/${id}`, { method: "DELETE" }),
  },

  haberler: {
    list: () => request<Haber[]>("/v1/news/our-news"),
    get: (id: string) => request<Haber>(`/v1/news/find/${id}`),
    create: (data: Partial<Haber>) =>
      request<void>("/v1/news/create", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Haber>) =>
      request<void>(`/v1/news/update/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/v1/news/delete/${id}`, { method: "DELETE" }),
  },
  messages: {
    list: () => request<Message[]>("/v1/messages"),
    delete: (id: string) =>
      request<void>(`/v1/messages/${id}`, { method: "DELETE" }),
  },
  isortaklari: {
    list: () => request<IsOrtagi[]>("/v1/isortaklari"),
    create: (data: Partial<IsOrtagi>) =>
      request<void>("/v1/isortaklari", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<IsOrtagi>) =>
      request<void>(`/v1/isortaklari/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/v1/isortaklari/${id}`, { method: "DELETE" }),
  },
  uploads: {
    upload: (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      return request<{ url: string }>("/v1/uploads", {
        method: "POST",
        body: formData,
      });
    },
  },
};
