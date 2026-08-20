import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../api/client";
import type { Haber } from "../../types";

const emptyForm = { haberAdi: "", haberDetayi: "", haberResmi: "" };

export default function AdminHaberler() {
  const [haberler, setHaberler] = useState<Haber[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.haberler
      .list()
      .then(setHaberler)
      .catch((e) => setMessage(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      if (editingId) {
        await api.haberler.update(editingId, form);
        setMessage("Haber güncellendi.");
      } else {
        await api.haberler.create(form);
        setMessage("Haber eklendi.");
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Hata oluştu");
    }
  };

  const handleEdit = (haber: Haber) => {
    setEditingId(haber.id);
    setForm({
      haberAdi: haber.haberAdi,
      haberDetayi: haber.haberDetayi,
      haberResmi: haber.haberResmi,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu haberi silmek istediğinize emin misiniz?")) return;
    try {
      await api.haberler.delete(id);
      setMessage("Haber silindi.");
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Silme hatası");
    }
  };

  return (
    <div>
      <h2>{editingId ? "Haber Düzenle" : "Yeni Haber Ekle"}</h2>
      {message && <p className={`admin-msg ${message.includes("Hata") ? "error" : "success"}`}>{message}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          Haber Başlığı *
          <input
            value={form.haberAdi}
            onChange={(e) => setForm({ ...form, haberAdi: e.target.value })}
            required
          />
        </label>
        <label>
          Haber Detayı *
          <textarea
            value={form.haberDetayi}
            onChange={(e) => setForm({ ...form, haberDetayi: e.target.value })}
            required
            rows={4}
          />
        </label>
        <label>
          Görsel URL *
          <input
            value={form.haberResmi}
            onChange={(e) => setForm({ ...form, haberResmi: e.target.value })}
            required
          />
        </label>
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingId ? "Güncelle" : "Ekle"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              İptal
            </button>
          )}
        </div>
      </form>

      <h2 className="admin-list-title">Mevcut Haberler</h2>
      {loading && <p>Yükleniyor...</p>}
      {!loading && haberler.length === 0 && <p>Henüz haber yok.</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Başlık</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {haberler.map((h) => (
              <tr key={h.id}>
                <td>{h.haberAdi}</td>
                <td className="actions">
                  <button type="button" onClick={() => handleEdit(h)}>
                    Düzenle
                  </button>
                  <button type="button" className="danger" onClick={() => handleDelete(h.id)}>
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
