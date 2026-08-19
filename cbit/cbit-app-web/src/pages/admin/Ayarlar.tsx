import { useEffect, useState } from "react";
import Alert from "../../components/Alert";
import { useSiteAyarlari } from "../../context/SiteAyarlariContext";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4101";

interface AyarlarState {
  projelerAktif: boolean;
  haberlerAktif: boolean;
  isOrtaklariAktif: boolean;
}

export default function AdminAyarlar() {
  const { ayarlar, loading: contextLoading } = useSiteAyarlari();
  const [formData, setFormData] = useState<AyarlarState>({
    projelerAktif: false,
    haberlerAktif: true,
    isOrtaklariAktif: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!contextLoading) {
      setFormData({
        projelerAktif: ayarlar.projelerAktif,
        haberlerAktif: ayarlar.haberlerAktif,
        isOrtaklariAktif: ayarlar.isOrtaklariAktif ?? true,
      });
    }
  }, [ayarlar, contextLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("cbit_token");
      const res = await fetch(`${API_BASE}/v1/ayarlar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Ayarlar güncellenirken hata oluştu.");
      }

      setMessage({ type: "success", text: "Ayarlar başarıyla güncellendi. Yenilemeniz gerekebilir." });
      
      // Auto reload the page to refresh context
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Bir hata oluştu." });
    } finally {
      setLoading(false);
    }
  };

  if (contextLoading) return <p>Yükleniyor...</p>;

  return (
    <div className="admin-page">
      <h2>Site Ayarları</h2>
      <p className="text-muted mb-large">Sitenin genel sayfalarının görünürlüğünü yönetin.</p>
      
      {message && <Alert type={message.type} message={message.text} />}

      <div className="card p-large mt-large" style={{ maxWidth: "600px" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
            <label htmlFor="projelerAktif" style={{ margin: 0, fontWeight: "bold" }}>Projeler Sayfası Aktif</label>
            <input
              type="checkbox"
              id="projelerAktif"
              name="projelerAktif"
              checked={formData.projelerAktif}
              onChange={handleChange}
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
          </div>

          <div className="form-group mt-base" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
            <label htmlFor="haberlerAktif" style={{ margin: 0, fontWeight: "bold" }}>Haberler Sayfası Aktif</label>
            <input
              type="checkbox"
              id="haberlerAktif"
              name="haberlerAktif"
              checked={formData.haberlerAktif}
              onChange={handleChange}
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
          </div>

          <div className="form-group mt-base" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
            <label htmlFor="isOrtaklariAktif" style={{ margin: 0, fontWeight: "bold" }}>İş Ortakları Sayfası Aktif</label>
            <input
              type="checkbox"
              id="isOrtaklariAktif"
              name="isOrtaklariAktif"
              checked={formData.isOrtaklariAktif}
              onChange={handleChange}
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
          </div>

          <button type="submit" className="btn-primary mt-large" disabled={loading}>
            {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
          </button>
        </form>
      </div>
    </div>
  );
}
