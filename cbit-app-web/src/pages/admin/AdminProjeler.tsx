import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../api/client";
import type { Proje } from "../../types";

const emptyForm = {
  projeAdi: "",
  projeDetayi: "",
  projeResmi: "",
  beyazAlan: "",
  sertifikasyon: "",
  itGucu: "",
  toplamKuruluGuc: "",
  projeSuresi: "",
  toplamInsaatAlani: "",
  durum: "",
};

export default function AdminProjeler() {
  const [projeler, setProjeler] = useState<Proje[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.projeler
      .list()
      .then(setProjeler)
      .catch((e) => setMessage(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const payload = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v.trim() !== ""),
    );

    try {
      if (editingId) {
        await api.projeler.update(editingId, payload);
        setMessage("Proje güncellendi.");
      } else {
        await api.projeler.create(payload);
        setMessage("Proje eklendi.");
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Hata oluştu");
    }
  };

  const handleEdit = (proje: Proje) => {
    setEditingId(proje.id);
    setForm({
      projeAdi: proje.projeAdi ?? "",
      projeDetayi: proje.projeDetayi ?? "",
      projeResmi: proje.projeResmi ?? "",
      beyazAlan: proje.beyazAlan ?? "",
      sertifikasyon: proje.sertifikasyon ?? "",
      itGucu: proje.itGucu ?? "",
      toplamKuruluGuc: proje.toplamKuruluGuc ?? "",
      projeSuresi: proje.projeSuresi ?? "",
      toplamInsaatAlani: proje.toplamInsaatAlani ?? "",
      durum: proje.durum ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    try {
      await api.projeler.delete(id);
      setMessage("Proje silindi.");
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Silme hatası");
    }
  };

  const fields: { key: keyof typeof emptyForm; label: string; required?: boolean }[] = [
    { key: "projeAdi", label: "Proje Adı", required: true },
    { key: "projeDetayi", label: "Açıklama" },
    { key: "projeResmi", label: "Görsel URL" },
    { key: "beyazAlan", label: "Beyaz Alan" },
    { key: "sertifikasyon", label: "Sertifikasyon" },
    { key: "itGucu", label: "IT Gücü" },
    { key: "toplamKuruluGuc", label: "Toplam Kurulu Güç" },
    { key: "projeSuresi", label: "Proje Süresi" },
    { key: "toplamInsaatAlani", label: "Toplam İnşaat Alanı" },
    { key: "durum", label: "Durum (ör: ZAMANINDA TESLİM)" },
  ];

  return (
    <div>
      <h2>{editingId ? "Proje Düzenle" : "Yeni Proje Ekle"}</h2>
      {message && <p className={`admin-msg ${message.includes("Hata") ? "error" : "success"}`}>{message}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {fields.map(({ key, label, required }) => (
            <label key={key}>
              {label}
              {required && " *"}
              <input
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required={required}
              />
            </label>
          ))}
        </div>
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

      <h2 className="admin-list-title">Mevcut Projeler</h2>
      {loading && <p>Yükleniyor...</p>}
      {!loading && projeler.length === 0 && <p>Henüz proje yok.</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Proje Adı</th>
              <th>Durum</th>
              <th>IT Gücü</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {projeler.map((p) => (
              <tr key={p.id}>
                <td>{p.projeAdi}</td>
                <td>{p.durum ?? "—"}</td>
                <td>{p.itGucu ?? "—"}</td>
                <td className="actions">
                  <button type="button" onClick={() => handleEdit(p)}>
                    Düzenle
                  </button>
                  <button type="button" className="danger" onClick={() => handleDelete(p.id)}>
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
