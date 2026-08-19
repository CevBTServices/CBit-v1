import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Haber } from "../types";
import { useLanguage } from "../context/useLanguage";
import { SkeletonCard } from "../components/SkeletonCard"; // Skeleton kart yükleyicimiz
import { Alert } from "../components/Alert"; // Zarif Alert kutusu

function HaberKart({ haber, lang }: { haber: Haber; lang: string }) {
  const name = lang === "en" ? (haber.haberAdiEn || haber.haberAdi) : haber.haberAdi;
  const detail = lang === "en" ? (haber.haberDetayiEn || haber.haberDetayi) : haber.haberDetayi;

  return (
    <div className="card proje-card">
      {haber.haberResmi && (
        <img
          src={haber.haberResmi}
          alt={name}
          className="proje-card-img"
        />
      )}
      <div className="proje-card-body">
        <div className="proje-card-header">
          <h3>{name}</h3>
        </div>
        {detail && <p className="proje-desc">{detail}</p>}
      </div>
    </div>
  );
}

export default function Haberler() {
  const [haberler, setHaberler] = useState<Haber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, lang } = useLanguage();

  useEffect(() => {
    api.haberler
      .list()
      .then(setHaberler)
      .catch((e: any) => {
        console.error("[NEWS FETCH ERROR]", e);
        setError("error");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">{t.haberler.baslik}</h1>
      <p className="page-subtitle">{t.haberler.altBaslik}</p>

      {/* Hata uyarısını modern alert kutusu ile gösteriyoruz */}
      {error && (
        <Alert type="error" message={t.haberler.hata} />
      )}

      {/* Boş veri durumunu bildiren Alert kutusu */}
      {!loading && !error && haberler.length === 0 && (
        <Alert type="info" message={t.haberler.bos} />
      )}

      <div className="grid-layout">
        {/* Yüklenirken Skeleton loading kartları gösterilir */}
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          : haberler.map((haber) => (
              <HaberKart key={haber.id} haber={haber} lang={lang} />
            ))}
      </div>
    </div>
  );
}
