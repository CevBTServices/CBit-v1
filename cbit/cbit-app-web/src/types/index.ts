export interface Proje {
  id: string;
  projeAdi: string;
  projeAdiEn?: string | null;
  projeDetayi?: string | null;
  projeDetayiEn?: string | null;
  projeResmi?: string | null;
  beyazAlan?: string | null;
  sertifikasyon?: string | null;
  itGucu?: string | null;
  toplamKuruluGuc?: string | null;
  projeSuresi?: string | null;
  toplamInsaatAlani?: string | null;
  durum?: string | null;
  durumEn?: string | null;
  createdAt: string;
}

export interface Haber {
  id: string;
  haberAdi: string;
  haberAdiEn?: string | null;
  haberDetayi: string;
  haberDetayiEn?: string | null;
  haberResmi: string;
  createdAt: string;
}

export interface Cozum {
  slug: string;
  baslik: string;
  baslikEn?: string;
  ozet: string;
  ozetEn?: string;
  resim?: string;
  icerik?: string[];
  maddeler?: string[];
}

export type ProjeFormData = Omit<Proje, "id" | "createdAt">;

export type HaberFormData = Omit<Haber, "id" | "createdAt">;

export interface IsOrtagi {
  id: string;
  adi: string;
  resim: string;
  kategori?: string | null;
  sira: number;
  createdAt: string;
}

