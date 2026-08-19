export interface SiteAyarlari {
  id: string;
  projelerAktif: boolean;
  haberlerAktif: boolean;
  isOrtaklariAktif: boolean;
  updatedAt: string;
}

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

export interface Message {
  id: string;
  adSoyad: string;
  eposta: string;
  konu: string;
  mesaj: string;
  createdAt: string;
}

export interface IsOrtagi {
  id: string;
  adi: string;
  resim: string;
  kategori?: string | null;
  sira: number;
  createdAt: string;
}

