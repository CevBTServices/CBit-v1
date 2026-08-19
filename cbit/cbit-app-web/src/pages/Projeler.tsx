import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Proje } from "../types";
import { useLanguage } from "../context/useLanguage";
import type { Translations } from "../i18n/tr";
import { SkeletonCard } from "../components/SkeletonCard"; // Skeleton kart yükleyicisini ekliyoruz
import { Alert } from "../components/Alert"; // Hata durumları için modern alert kutusu

function ProjeKart({ proje, t, lang }: { proje: Proje; t: Translations; lang: string }) {
  const name = lang === "en" ? (proje.projeAdiEn || proje.projeAdi) : proje.projeAdi;
  const detail = lang === "en" ? (proje.projeDetayiEn || proje.projeDetayi) : proje.projeDetayi;
  const status = lang === "en" ? (proje.durumEn || proje.durum) : proje.durum;

  const specs = [
    { label: t.projeler.beyazAlan, value: proje.beyazAlan },
    { label: t.projeler.sertifikasyon, value: proje.sertifikasyon },
    { label: t.projeler.itGucu, value: proje.itGucu },
    { label: t.projeler.toplamKuruluGuc, value: proje.toplamKuruluGuc },
    { 
      label: t.projeler.projeSuresi, 
      value: proje.projeSuresi 
        ? String(proje.projeSuresi).match(/ay|month/i) 
          ? proje.projeSuresi 
          : `${proje.projeSuresi} ${lang === 'en' ? 'months' : 'ay'}` 
        : proje.projeSuresi 
    },
    { label: t.projeler.insaatAlani, value: proje.toplamInsaatAlani },
  ].filter((s) => s.value);

  return (
    <div className="card proje-card">
      {proje.projeResmi && (
        <img
          src={proje.projeResmi}
          alt={name}
          className="proje-card-img"
        />
      )}
      <div className="proje-card-body">
        <div className="proje-card-header">
          <h3>{name}</h3>
          {status && (
            <span
              className={`durum-badge ${
                ["tamamlandı", "zamanında teslim", "completed", "delivered", "on-time", "on time", "ontime"].some((k) =>
                  status.toLowerCase().includes(k),
                )
                  ? "durum-yesil"
                  : "durum-sari"
              }`}
            >
              {status}
            </span>
          )}
        </div>
        {detail && <p className="proje-desc">{detail}</p>}
        {specs.length > 0 && (
          <dl className="spec-list">
            {specs.map((s) => (
              <div key={s.label} className="spec-row">
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}

export default function Projeler() {
  const [projeler, setProjeler] = useState<Proje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, lang } = useLanguage();

  useEffect(() => {
    api.projeler
      .list()
      .then(setProjeler)
      .catch((e) => {
        console.error("[PROJECTS FETCH ERROR]", e);
        setError("error");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">{t.projeler.baslik}</h1>
      <p className="page-subtitle">{t.projeler.altBaslik}</p>

      {/* Hata durumunu zarif Alert kutusu ile bildiriyoruz */}
      {error && (
        <Alert type="error" message={t.projeler.hata} />
      )}

      {/* Boş veri durumunu bildiren Alert kutusu */}
      {!loading && !error && projeler.length === 0 && (
        <Alert type="info" message={t.projeler.bos} />
      )}

      <div className="grid-layout">
        {/* Yüklenirken düz yazı yerine 3 adet yan yana Skeleton loader gösteriyoruz */}
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          : projeler.map((proje) => (
              <ProjeKart key={proje.id} proje={proje} t={t} lang={lang} />
            ))}
      </div>
    </div>
  );
}
