import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { SiteAyarlari } from "../types";

export default function Ayarlar() {
  const [ayarlar, setAyarlar] = useState<SiteAyarlari | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    api.ayarlar
      .get()
      .then(setAyarlar)
      .catch(() =>
        setMessage({ type: "error", text: "Ayarlar yüklenemedi." })
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleToggle = async (field: keyof Pick<SiteAyarlari, "projelerAktif" | "haberlerAktif" | "isOrtaklariAktif">) => {
    if (!ayarlar || saving) return;
    const newValue = !ayarlar[field];
    setSaving(true);
    try {
      const updated = await api.ayarlar.update({ [field]: newValue });
      setAyarlar(updated);
      const pageName = field === "projelerAktif" ? "Projeler" : "Haberler";
      setMessage({
        type: "success",
        text: `${pageName} sayfası ${newValue ? "aktif edildi" : "gizlendi"}.`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Kaydetme hatası.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Site Ayarları</h1>
          <p className="page-subtitle">
            Web sitesinde hangi sayfaların görüneceğini buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="form-card">
        <h3 style={{ marginBottom: "24px", fontFamily: "var(--font-display)" }}>
          Sayfa Görünürlüğü
        </h3>

        {loading ? (
          <div style={{ color: "var(--text-secondary)", padding: "20px 0" }}>
            Yükleniyor...
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  Projeler / Referanslar Sayfası
                </p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  {ayarlar?.projelerAktif
                    ? "Sitede görünüyor — ziyaretçiler erişebilir."
                    : "Sitede gizli — ziyaretçiler erişemez."}
                </p>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => handleToggle("projelerAktif")}
                disabled={saving}
                aria-label="Projeler sayfasını aç/kapat"
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  width: "52px",
                  height: "28px",
                  borderRadius: "14px",
                  border: "none",
                  cursor: saving ? "not-allowed" : "pointer",
                  background: ayarlar?.projelerAktif ? "#AC0000" : "var(--border)",
                  transition: "background 0.25s ease",
                  flexShrink: 0,
                  opacity: saving ? 0.6 : 1,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: ayarlar?.projelerAktif ? "27px" : "3px",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    transition: "left 0.25s ease",
                  }}
                />
              </button>
            </div>
            
            {/* Haberler Toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  Haberler Sayfası
                </p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  {ayarlar?.haberlerAktif
                    ? "Sitede görünüyor — ziyaretçiler erişebilir."
                    : "Sitede gizli — ziyaretçiler erişemez."}
                </p>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => handleToggle("haberlerAktif")}
                disabled={saving}
                aria-label="Haberler sayfasını aç/kapat"
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  width: "52px",
                  height: "28px",
                  borderRadius: "14px",
                  border: "none",
                  cursor: saving ? "not-allowed" : "pointer",
                  background: ayarlar?.haberlerAktif ? "#AC0000" : "var(--border)",
                  transition: "background 0.25s ease",
                  flexShrink: 0,
                  opacity: saving ? 0.6 : 1,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: ayarlar?.haberlerAktif ? "27px" : "3px",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    transition: "left 0.25s ease",
                  }}
                />
              </button>
            </div>

            {/* İş Ortakları Toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 0",
              }}
            >
              <div>
                <p
                  style={{
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  İş Ortakları Sayfası
                </p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  {ayarlar?.isOrtaklariAktif
                    ? "Sitede görünüyor — ziyaretçiler erişebilir."
                    : "Sitede gizli — ziyaretçiler erişemez."}
                </p>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => handleToggle("isOrtaklariAktif")}
                disabled={saving}
                aria-label="İş Ortakları sayfasını aç/kapat"
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  width: "52px",
                  height: "28px",
                  borderRadius: "14px",
                  border: "none",
                  cursor: saving ? "not-allowed" : "pointer",
                  background: ayarlar?.isOrtaklariAktif ? "#AC0000" : "var(--border)",
                  transition: "background 0.25s ease",
                  flexShrink: 0,
                  opacity: saving ? 0.6 : 1,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: ayarlar?.isOrtaklariAktif ? "27px" : "3px",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    transition: "left 0.25s ease",
                  }}
                />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
