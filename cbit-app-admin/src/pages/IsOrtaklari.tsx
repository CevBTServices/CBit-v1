import { useEffect, useState, useRef, type FormEvent } from "react";
import { api } from "../api/client";
import type { IsOrtagi } from "../types";

const emptyForm = { adi: "", kategori: "", sira: "0", resim: "" };

export default function IsOrtaklari() {
  const [isOrtaklari, setIsOrtaklari] = useState<IsOrtagi[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    api.isortaklari
      .list()
      .then(setIsOrtaklari)
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

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setMessage(null);
    try {
      const res = await api.uploads.upload(file);
      setForm((prev) => ({ ...prev, resim: res.url }));
      setMessage({ type: "success", text: "Görsel başarıyla yüklendi." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Dosya yüklenirken hata oluştu",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      if (!form.resim) {
        setMessage({ type: "error", text: "Lütfen bir resim yükleyin." });
        return;
      }
      
      const payload = {
        adi: form.adi,
        kategori: form.kategori || undefined,
        sira: parseInt(form.sira) || 0,
        resim: form.resim,
      };

      if (editingId) {
        await api.isortaklari.update(editingId, payload);
        setMessage({ type: "success", text: "İş ortağı güncellendi." });
      } else {
        await api.isortaklari.create(payload);
        setMessage({ type: "success", text: "İş ortağı eklendi." });
      }

      resetForm();
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Hata oluştu",
      });
    }
  };

  const handleEdit = (partner: IsOrtagi) => {
    setEditingId(partner.id);
    setForm({
      adi: partner.adi,
      kategori: partner.kategori || "",
      sira: partner.sira.toString(),
      resim: partner.resim,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setMessage(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu iş ortağını silmek istediğinize emin misiniz?")) return;
    try {
      await api.isortaklari.delete(id);
      setMessage({ type: "success", text: "İş ortağı silindi." });
      if (editingId === id) {
        resetForm();
      }
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Silme hatası",
      });
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsFormOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Resim URL'sini çözümle
  const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4101";
  const getImageUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    const cleanBase = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
    return `${cleanBase}${path}`;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">İş Ortakları Yönetimi</h1>
          <p className="page-subtitle">İş ortaklarını buradan yönetebilirsiniz.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
        >
          Yeni İş Ortağı Ekle
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'}`}>
          {message.text}
        </div>
      )}

      {isFormOpen && (
        <div className="card form-card" style={{ marginBottom: '20px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Adı *</label>
              <input
                type="text"
                className="form-control"
                value={form.adi}
                onChange={(e) => setForm({ ...form, adi: e.target.value })}
                required
                placeholder="Nvidia, Huawei vb."
              />
            </div>
            
            <div className="form-group">
              <label>Kategori</label>
              <input
                type="text"
                className="form-control"
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                placeholder="Bilişim ve YZ Altyapısı vb."
              />
            </div>

            <div className="form-group">
              <label>Sıralama</label>
              <input
                type="number"
                className="form-control"
                value={form.sira}
                onChange={(e) => setForm({ ...form, sira: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Logo Yükle *</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                disabled={uploading}
              />
              {uploading && <small style={{ color: '#007bff' }}>Yükleniyor...</small>}
              {form.resim && !uploading && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={getImageUrl(form.resim)}
                    alt="Önizleme"
                    style={{ height: '60px', objectFit: 'contain' }}
                  />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                İptal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={uploading}
              >
                {editingId ? "Güncelle" : "Kaydet"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Adı</th>
                <th>Kategori</th>
                <th>Sıra</th>
                <th style={{ textAlign: 'right' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                    Yükleniyor...
                  </td>
                </tr>
              ) : isOrtaklari.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                    Henüz iş ortağı bulunmuyor.
                  </td>
                </tr>
              ) : (
                isOrtaklari.map((partner) => (
                  <tr key={partner.id}>
                    <td>
                      <img
                        src={getImageUrl(partner.resim)}
                        alt={partner.adi}
                        style={{ height: '40px', width: 'auto', objectFit: 'contain', backgroundColor: '#f8f9fa', padding: '4px', borderRadius: '4px' }}
                      />
                    </td>
                    <td>{partner.adi}</td>
                    <td>{partner.kategori || "-"}</td>
                    <td>{partner.sira}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => handleEdit(partner)}
                          title="Düzenle"
                        >
                          Düzenle
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDelete(partner.id)}
                          title="Sil"
                          style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
