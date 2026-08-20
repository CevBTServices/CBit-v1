import { useEffect, useState, useRef, type FormEvent } from "react";
import { api } from "../api/client";
import type { Haber } from "../types";

const emptyForm = {
  haberAdi: "",
  haberAdiEn: "",
  haberDetayi: "",
  haberDetayiEn: "",
  haberResmi: "",
};

export default function News() {
  const [news, setNews] = useState<Haber[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setMessage(null);
    try {
      const res = await api.uploads.upload(file);
      setForm((prev) => ({ ...prev, haberResmi: res.url }));
      setMessage({ type: "success", text: "Görsel başarıyla yüklendi." });
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Dosya yüklenirken hata oluştu",
      });
    } finally {
      setUploading(false);
    }
  };

  const load = () => {
    setLoading(true);
    api.haberler
      .list()
      .then(setNews)
      .catch((e) => setMessage({ type: "error", text: e.message }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (editingId) {
        // Düzenleme modunda filtreleme yapma, tüm alanları gönder
        await api.haberler.update(editingId, form);
        setMessage({ type: "success", text: "Haber başarıyla güncellendi." });
      } else {
        // Sadece yeni eklerken boşları çıkar
        const payload = Object.fromEntries(
          Object.entries(form).filter(([, v]) => v.trim() !== ""),
        );
        await api.haberler.create(payload);
        setMessage({ type: "success", text: "Haber başarıyla eklendi." });
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "İşlem sırasında hata oluştu",
      });
    }
  };

  const handleEdit = (haber: Haber) => {
    setEditingId(haber.id);
    setForm({
      haberAdi: haber.haberAdi ?? "",
      haberAdiEn: haber.haberAdiEn ?? "",
      haberDetayi: haber.haberDetayi ?? "",
      haberDetayiEn: haber.haberDetayiEn ?? "",
      haberResmi: haber.haberResmi ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu haberi silmek istediğinize emin misiniz?")) return;
    try {
      await api.haberler.delete(id);
      setMessage({ type: "success", text: "Haber başarıyla silindi." });
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Silme hatası oluştu",
      });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Haberler</h1>
          <p className="page-subtitle">
            CBIT haber ve duyurularını buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="form-card">
        <h3 style={{ marginBottom: "20px", fontFamily: "var(--font-display)" }}>
          {editingId ? "Haberi Düzenle" : "Yeni Haber Ekle"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group form-full-width">
              <label className="form-label">Haber Başlığı *</label>
              <input
                className="form-control"
                value={form.haberAdi}
                onChange={(e) => setForm({ ...form, haberAdi: e.target.value })}
                required
                placeholder="Ör: Sürdürülebilir Gelecek İçin Yeni Yatırımlar"
              />
            </div>
            <div className="form-group form-full-width">
              <label className="form-label">Haber Başlığı (EN)</label>
              <input
                className="form-control"
                value={form.haberAdiEn}
                onChange={(e) =>
                  setForm({ ...form, haberAdiEn: e.target.value })
                }
                placeholder="Ör: New Investments for a Sustainable Future"
              />
            </div>
            <div className="form-group form-full-width">
              <label className="form-label">Haber Görseli *</label>
              <div
                className={`dropzone ${isDragging ? "dragging" : ""} ${
                  form.haberResmi ? "has-file" : ""
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileUpload(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed var(--border)",
                  borderRadius: "8px",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: isDragging
                    ? "rgba(0,0,0,0.05)"
                    : "transparent",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "150px",
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  style={{ display: "none" }}
                  accept="image/*"
                />
                {uploading ? (
                  <div style={{ color: "var(--text-secondary)" }}>
                    Görsel yükleniyor...
                  </div>
                ) : form.haberResmi ? (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      maxWidth: "300px",
                    }}
                  >
                    <img
                      src={form.haberResmi}
                      alt="Haber önizleme"
                      style={{
                        width: "100%",
                        maxHeight: "150px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setForm({ ...form, haberResmi: "" });
                      }}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        padding: "5px 10px",
                        fontSize: "12px",
                        minHeight: "auto",
                      }}
                    >
                      Kaldır
                    </button>
                  </div>
                ) : (
                  <div
                    style={{ color: "var(--text-secondary)", fontSize: "14px" }}
                  >
                    <p style={{ margin: "0 0 5px 0", fontWeight: "600" }}>
                      Görseli buraya sürükleyin veya seçmek için tıklayın
                    </p>
                    <p style={{ margin: 0, fontSize: "12px" }}>
                      PNG, JPG, JPEG, WEBP (Max: 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="form-group form-full-width">
              <label className="form-label">Haber Detayı / İçerik *</label>
              <textarea
                className="form-control"
                value={form.haberDetayi}
                onChange={(e) =>
                  setForm({ ...form, haberDetayi: e.target.value })
                }
                required
                placeholder="Haber içeriğini giriniz..."
              />
            </div>
            <div className="form-group form-full-width">
              <label className="form-label">Haber Detayı / İçerik (EN)</label>
              <textarea
                className="form-control"
                value={form.haberDetayiEn}
                onChange={(e) =>
                  setForm({ ...form, haberDetayiEn: e.target.value })
                }
                placeholder="Enter news content in English..."
              />
            </div>
          </div>

          <div className="form-buttons">
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                İptal
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {editingId ? "Kaydet" : "Ekle"}
            </button>
          </div>
        </form>
      </div>

      <div className="card-table-wrap">
        <div className="table-header">
          <span className="table-header-title">Mevcut Haberler</span>
        </div>
        <div className="table-container">
          {loading ? (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                color: "var(--text-secondary)",
              }}
            >
              Yükleniyor...
            </div>
          ) : news.length === 0 ? (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                color: "var(--text-secondary)",
              }}
            >
              Kayıtlı haber bulunamadı.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Görsel</th>
                  <th>Haber Başlığı</th>
                  <th>Eklenme Tarihi</th>
                  <th style={{ width: "150px" }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {news.map((h) => (
                  <tr key={h.id}>
                    <td>
                      {h.haberResmi ? (
                        <img
                          className="cell-image"
                          src={h.haberResmi}
                          alt={h.haberAdi}
                        />
                      ) : (
                        <div
                          className="cell-image"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          Yok
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{h.haberAdi}</td>
                    <td>{new Date(h.createdAt).toLocaleDateString("tr-TR")}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEdit(h)}
                        >
                          Düzenle
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(h.id)}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
