import { useEffect, useState, useRef, type FormEvent } from "react";
import { api } from "../api/client";
import type { YasalMetin } from "../types";

const emptyForm = {
  baslik: "",
  baslikEn: "",
  aciklama: "",
  aciklamaEn: "",
  dosyaYolu: "",
};

export default function YasalMetinler() {
  const [docs, setDocs] = useState<YasalMetin[]>([]);
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
      setForm((prev) => ({ ...prev, dosyaYolu: res.url }));
      setMessage({ type: "success", text: "Dosya başarıyla yüklendi." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Dosya yüklenirken hata oluştu",
      });
    } finally {
      setUploading(false);
    }
  };

  const load = () => {
    setLoading(true);
    api.yasalMetinler
      .list()
      .then(setDocs)
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
      if (!form.dosyaYolu) {
        setMessage({ type: "error", text: "Lütfen bir dosya yükleyin." });
        return;
      }

      if (editingId) {
        await api.yasalMetinler.update(editingId, form);
        setMessage({ type: "success", text: "Yasal metin başarıyla güncellendi." });
      } else {
        const payload = Object.fromEntries(
          Object.entries(form).filter(([, v]) => v.trim() !== ""),
        );
        await api.yasalMetinler.create(payload);
        setMessage({ type: "success", text: "Yasal metin başarıyla eklendi." });
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "İşlem sırasında hata oluştu",
      });
    }
  };

  const handleEdit = (doc: YasalMetin) => {
    setEditingId(doc.id);
    setForm({
      baslik: doc.baslik ?? "",
      baslikEn: doc.baslikEn ?? "",
      aciklama: doc.aciklama ?? "",
      aciklamaEn: doc.aciklamaEn ?? "",
      dosyaYolu: doc.dosyaYolu ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu yasal metni silmek istediğinize emin misiniz?")) return;
    try {
      await api.yasalMetinler.delete(id);
      setMessage({ type: "success", text: "Yasal metin başarıyla silindi." });
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

  const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4101";
  const getFileUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    const cleanBase = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
    return `${cleanBase}${path}`;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Yasal Metinler</h1>
          <p className="page-subtitle">
            KVKK, Gizlilik Sözleşmesi, Çerez Politikası gibi yasal belgeleri buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`}>{message.text}</div>
      )}

      <div className="card form-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: "20px", fontWeight: "600", fontSize: "18px" }}>
          {editingId ? "Yasal Metni Düzenle" : "Yeni Yasal Metin Ekle"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Başlık (TR) *</label>
            <input
              className="form-control"
              value={form.baslik}
              onChange={(e) => setForm({ ...form, baslik: e.target.value })}
              required
              placeholder="Ör: Kişisel Verilerin Korunması"
            />
          </div>
          
          <div className="form-group">
            <label>Başlık (EN)</label>
            <input
              className="form-control"
              value={form.baslikEn}
              onChange={(e) => setForm({ ...form, baslikEn: e.target.value })}
              placeholder="Ör: Protection of Personal Data"
            />
          </div>

          <div className="form-group">
            <label>Açıklama (TR) *</label>
            <textarea
              className="form-control"
              value={form.aciklama}
              onChange={(e) => setForm({ ...form, aciklama: e.target.value })}
              required
              rows={3}
              placeholder="Kısa Türkçe açıklama..."
            />
          </div>

          <div className="form-group">
            <label>Açıklama (EN)</label>
            <textarea
              className="form-control"
              value={form.aciklamaEn}
              onChange={(e) => setForm({ ...form, aciklamaEn: e.target.value })}
              rows={3}
              placeholder="Kısa İngilizce açıklama..."
            />
          </div>

          <div className="form-group">
            <label>Dosya Yükle (PDF / RTF) *</label>
            <div
              className={`dropzone ${isDragging ? "dragging" : ""} ${
                form.dosyaYolu ? "has-file" : ""
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
                border: "2px dashed #ddd",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isDragging ? "#f8f9fa" : "transparent",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100px",
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
                accept=".pdf,.rtf,application/pdf,application/rtf,text/rtf"
              />
              {uploading ? (
                <div style={{ color: "#6c757d" }}>Dosya yükleniyor...</div>
              ) : form.dosyaYolu ? (
                <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
                  <div style={{ padding: "15px", backgroundColor: "rgba(227, 24, 55, 0.1)", borderRadius: "8px", color: "var(--color-primary)", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Dosya Yüklendi
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setForm({ ...form, dosyaYolu: "" });
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "-10px",
                      padding: "5px 10px",
                      fontSize: "12px",
                      minHeight: "auto",
                    }}
                  >
                    Kaldır
                  </button>
                </div>
              ) : (
                <div style={{ color: "#6c757d", fontSize: "14px" }}>
                  <p style={{ margin: "0 0 5px 0", fontWeight: "600" }}>
                    PDF veya RTF dosyasını sürükleyin veya seçmek için tıklayın
                  </p>
                  <p style={{ margin: 0, fontSize: "12px" }}>Max: 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions" style={{ justifyContent: "flex-end" }}>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                İptal
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {editingId ? "Güncelle" : "Kaydet"}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div style={{ padding: "20px", borderBottom: "1px solid #e0e0e0" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", textTransform: "uppercase" }}>Mevcut Yasal Metinler</h3>
        </div>
        <div className="table-responsive">
          {loading ? (
            <div style={{ padding: "30px", textAlign: "center", color: "#6c757d" }}>
              Yükleniyor...
            </div>
          ) : docs.length === 0 ? (
            <div style={{ padding: "30px", textAlign: "center", color: "#6c757d" }}>
              Kayıtlı yasal metin bulunamadı.
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>BAŞLIK (TR)</th>
                  <th>BAŞLIK (EN)</th>
                  <th>DOSYA</th>
                  <th style={{ textAlign: "right", width: "150px" }}>İŞLEMLER</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc) => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 600 }}>{doc.baslik}</td>
                    <td>{doc.baslikEn || "—"}</td>
                    <td>
                      {doc.dosyaYolu ? (
                        <a href={getFileUrl(doc.dosyaYolu)} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>
                          Görüntüle
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="action-buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => handleEdit(doc)}
                          title="Düzenle"
                        >
                          Düzenle
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDelete(doc.id)}
                          title="Sil"
                          style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
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
