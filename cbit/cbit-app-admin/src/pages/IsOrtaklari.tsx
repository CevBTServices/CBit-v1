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

      setForm(emptyForm);
      setEditingId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu iş ortağını silmek istediğinize emin misiniz?")) return;
    try {
      await api.isortaklari.delete(id);
      setMessage({ type: "success", text: "İş ortağı silindi." });
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
      load();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Silme hatası",
      });
    }
  };

  // Resim URL'sini çözümle
  const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4101";
  const getImageUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    const cleanBase = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
    return `${cleanBase}${path}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">İş Ortakları Yönetimi</h1>
      </div>

      {message && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {editingId ? "İş Ortağı Düzenle" : "Yeni İş Ortağı Ekle"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adı *
              </label>
              <input
                type="text"
                value={form.adi}
                onChange={(e) => setForm({ ...form, adi: e.target.value })}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Nvidia, Huawei vb."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <input
                type="text"
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Bilişim ve YZ Altyapısı vb."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sıralama
              </label>
              <input
                type="number"
                value={form.sira}
                onChange={(e) => setForm({ ...form, sira: e.target.value })}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo Yükle *
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="w-full"
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-blue-600 mt-1">Yükleniyor...</p>}
              {form.resim && !uploading && (
                <div className="mt-2">
                  <img
                    src={getImageUrl(form.resim)}
                    alt="Önizleme"
                    className="h-12 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  setMessage(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                İptal
              </button>
            )}
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {editingId ? "Güncelle" : "Ekle"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sıra</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : isOrtaklari.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Henüz iş ortağı bulunmuyor.
                  </td>
                </tr>
              ) : (
                isOrtaklari.map((partner) => (
                  <tr key={partner.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={getImageUrl(partner.resim)}
                        alt={partner.adi}
                        className="h-10 w-auto object-contain bg-gray-50 p-1 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{partner.adi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{partner.kategori || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{partner.sira}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(partner)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(partner.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Sil
                      </button>
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
