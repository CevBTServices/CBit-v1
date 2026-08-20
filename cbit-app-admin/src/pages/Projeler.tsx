import { useEffect, useState, useRef, type FormEvent } from "react";
import { api } from "../api/client";
import type { Proje } from "../types";

const emptyForm = {
  projeAdi: "",
  projeAdiEn: "",
  projeDetayi: "",
  projeDetayiEn: "",
  projeResmi: "",
  beyazAlan: "",
  sertifikasyon: "",
  itGucu: "",
  toplamKuruluGuc: "",
  projeSuresi: "",
  toplamInsaatAlani: "",
  durum: "",
  durumEn: "",
};

export default function Projeler() {
  const [projeler, setProjeler] = useState<Proje[]>([]);
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
      setForm((prev) => ({ ...prev, projeResmi: res.url }));
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
    api.projeler
      .list()
      .then(setProjeler)
      .catch((e) => setMessage({ type: "error", text: e.message }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (editingId) {
        await api.projeler.update(editingId, form);
        setMessage({ type: "success", text: "Proje başarıyla güncellendi." });
      } else {
        const payload = Object.fromEntries(
          Object.entries(form).filter(([, v]) => v.trim() !== ""),
        );
        await api.projeler.create(payload);
        setMessage({ type: "success", text: "Proje başarıyla eklendi." });
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

  const handleEdit = (proje: Proje) => {
    setEditingId(proje.id);
    setForm({
      projeAdi: proje.projeAdi ?? "",
      projeAdiEn: proje.projeAdiEn ?? "",
      projeDetayi: proje.projeDetayi ?? "",
      projeDetayiEn: proje.projeDetayiEn ?? "",
      projeResmi: proje.projeResmi ?? "",
      beyazAlan: proje.beyazAlan ?? "",
      sertifikasyon: proje.sertifikasyon ?? "",
      itGucu: proje.itGucu ?? "",
      toplamKuruluGuc: proje.toplamKuruluGuc ?? "",
      projeSuresi: proje.projeSuresi ?? "",
      toplamInsaatAlani: proje.toplamInsaatAlani ?? "",
      durum: proje.durum ?? "",
      durumEn: proje.durumEn ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    try {
      await api.projeler.delete(id);
      setMessage({ type: "success", text: "Proje başarıyla silindi." });
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
          <h1 className="page-title">Projeler</h1>
          <p className="page-subtitle">
            Proje kayıtlarını buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      <div className="form-card">
        <h3 style={{ marginBottom: "20px", fontFamily: "var(--font-display)" }}>
          {editingId ? "Projeyi Düzenle" : "Yeni Proje Ekle"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group form-full-width">
              <label className="form-label">Proje Adı *</label>
              <input
                className="form-control"
                value={form.projeAdi}
                onChange={(e) => setForm({ ...form, projeAdi: e.target.value })}
                required
                placeholder="Ör: GES Santral Projesi"
              />
            </div>
            <div className="form-group form-full-width">
              <label className="form-label">Proje Adı (EN)</label>
              <input
                className="form-control"
                value={form.projeAdiEn}
                onChange={(e) =>
                  setForm({ ...form, projeAdiEn: e.target.value })
                }
                placeholder="Ör: Solar Power Plant Project"
              />
            </div>

            <div className="form-group form-full-width">
              <label className="form-label">Proje Görseli</label>
              <div
                className={`dropzone ${isDragging ? "dragging" : ""} ${
                  form.projeResmi ? "has-file" : ""
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
                ) : form.projeResmi ? (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      maxWidth: "300px",
                    }}
                  >
                    <img
                      src={form.projeResmi}
                      alt="Proje önizleme"
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
                        setForm({ ...form, projeResmi: "" });
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
              <label className="form-label">Proje Detayı</label>
              <textarea
                className="form-control"
                value={form.projeDetayi}
                onChange={(e) =>
                  setForm({ ...form, projeDetayi: e.target.value })
                }
                placeholder="Proje içeriğini giriniz..."
              />
            </div>
            <div className="form-group form-full-width">
              <label className="form-label">Proje Detayı (EN)</label>
              <textarea
                className="form-control"
                value={form.projeDetayiEn}
                onChange={(e) =>
                  setForm({ ...form, projeDetayiEn: e.target.value })
                }
                placeholder="Enter project content in English..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Beyaz Alan</label>
              <input
                className="form-control"
                value={form.beyazAlan}
                onChange={(e) =>
                  setForm({ ...form, beyazAlan: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Sertifikasyon</label>
              <input
                className="form-control"
                value={form.sertifikasyon}
                onChange={(e) =>
                  setForm({ ...form, sertifikasyon: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">IT Gücü</label>
              <input
                className="form-control"
                value={form.itGucu}
                onChange={(e) => setForm({ ...form, itGucu: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Toplam Kurulu Güç</label>
              <input
                className="form-control"
                value={form.toplamKuruluGuc}
                onChange={(e) =>
                  setForm({ ...form, toplamKuruluGuc: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Proje Süresi</label>
              <input
                className="form-control"
                value={form.projeSuresi}
                onChange={(e) =>
                  setForm({ ...form, projeSuresi: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Toplam İnşaat Alanı</label>
              <input
                className="form-control"
                value={form.toplamInsaatAlani}
                onChange={(e) =>
                  setForm({ ...form, toplamInsaatAlani: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Durum</label>
              <input
                className="form-control"
                value={form.durum}
                onChange={(e) => setForm({ ...form, durum: e.target.value })}
                placeholder="Ör: Devam Ediyor"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Durum (EN)</label>
              <input
                className="form-control"
                value={form.durumEn}
                onChange={(e) => setForm({ ...form, durumEn: e.target.value })}
                placeholder="Ex: In Progress"
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
          <span className="table-header-title">Mevcut Projeler</span>
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
          ) : projeler.length === 0 ? (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                color: "var(--text-secondary)",
              }}
            >
              Kayıtlı proje bulunamadı.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Görsel</th>
                  <th>Proje Adı</th>
                  <th>Durum</th>
                  <th>Eklenme Tarihi</th>
                  <th style={{ width: "150px" }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {projeler.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.projeResmi ? (
                        <img
                          className="cell-image"
                          src={p.projeResmi}
                          alt={p.projeAdi}
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
                    <td style={{ fontWeight: 600 }}>{p.projeAdi}</td>
                    <td>{p.durum || "-"}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString("tr-TR")}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEdit(p)}
                        >
                          Düzenle
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(p.id)}
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
