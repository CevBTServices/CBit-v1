import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Message } from "../types";
import { Mail, Calendar, User, Eye, Trash2, X } from "lucide-react";

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.messages.list();
      setMessages(data || []);
    } catch (err) {
      console.error(err);
      setAlertMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Mesajlar yüklenirken hata oluştu",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => {
        setAlertMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening preview modal
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    try {
      await api.messages.delete(id);
      setAlertMsg({ type: "success", text: "Mesaj başarıyla silindi." });
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      load();
    } catch (err) {
      setAlertMsg({
        type: "error",
        text: err instanceof Error ? err.message : "Silme işlemi başarısız oldu",
      });
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mesaj Kutusu</h1>
          <p className="page-subtitle">
            İletişim formundan gelen kullanıcı mesajlarını ve taleplerini buradan takip edebilirsiniz.
          </p>
        </div>
      </div>

      {alertMsg && (
        <div className={`alert alert-${alertMsg.type}`} style={{ marginBottom: "20px" }}>
          {alertMsg.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: "30px" }}>
        <div className="stat-card">
          <span className="stat-label">Toplam Mesaj</span>
          <span className="stat-value">{loading ? "..." : messages.length}</span>
          <span className="stat-desc">Kullanıcılardan gelen tüm iletiler</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Son Mesaj Tarihi</span>
          <span className="stat-value" style={{ fontSize: "1.2rem", padding: "10px 0" }}>
            {loading
              ? "..."
              : messages.length > 0
              ? formatDate(messages[0].createdAt)
              : "Mesaj yok"}
          </span>
          <span className="stat-desc">Gelen en son iletinin zamanı</span>
        </div>
      </div>

      {/* Messages List Table */}
      <div className="card-table-wrap">
        <div className="table-header">
          <span className="table-header-title">Gelen İletiler</span>
        </div>
        <div className="table-container">
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
              Mesajlar yükleniyor...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
              Henüz gelen bir mesaj bulunmuyor.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Gönderen</th>
                  <th>E-posta</th>
                  <th>Konu</th>
                  <th>Tarih</th>
                  <th style={{ width: "180px", textAlign: "center" }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedMessage(m)}
                    style={{ cursor: "pointer" }}
                    className="message-row-hover"
                  >
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
                        <User size={16} className="text-secondary" />
                        {m.adSoyad}
                      </div>
                    </td>
                    <td>{m.eposta}</td>
                    <td style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {m.konu}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        <Calendar size={14} />
                        {formatDate(m.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: "6px 12px", display: "flex", alignItems: "center", gap: "4px" }}
                          onClick={() => setSelectedMessage(m)}
                        >
                          <Eye size={15} />
                          Oku
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{
                            padding: "6px 12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            backgroundColor: "var(--accent-red)",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                          onClick={(e) => handleDelete(m.id, e)}
                        >
                          <Trash2 size={15} />
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

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px", width: "100%", padding: "30px", position: "relative" }}>
            <button
              onClick={() => setSelectedMessage(null)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
              }}
            >
              <X size={24} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <Mail size={24} className="text-primary" style={{ color: "var(--primary-color)" }} />
              <h2 style={{ fontSize: "1.4rem", fontWeight: "700" }}>Mesaj Detayı</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px", fontSize: "0.95rem" }}>
              <div>
                <strong style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase" }}>Gönderen</strong>
                <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>{selectedMessage.adSoyad}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <strong style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase" }}>E-posta</strong>
                  <a href={`mailto:${selectedMessage.eposta}`} style={{ color: "var(--primary-color)", textDecoration: "underline" }}>{selectedMessage.eposta}</a>
                </div>
                <div>
                  <strong style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase" }}>Tarih</strong>
                  <span>{formatDate(selectedMessage.createdAt)}</span>
                </div>
              </div>
              <div>
                <strong style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase" }}>Konu</strong>
                <span style={{ fontWeight: "600" }}>{selectedMessage.konu}</span>
              </div>
              <div style={{ borderTop: "1px solid #eee", paddingTop: "15px", marginTop: "5px" }}>
                <strong style={{ display: "block", color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: "8px" }}>Mesaj</strong>
                <div style={{ backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "6px", lineHeight: "1.6", whiteSpace: "pre-wrap", border: "1px solid #eee", color: "#333", maxHeight: "250px", overflowY: "auto" }}>
                  {selectedMessage.mesaj}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "25px" }}>
              <button className="btn btn-secondary" onClick={() => setSelectedMessage(null)}>
                Kapat
              </button>
              <button
                className="btn btn-danger"
                style={{ backgroundColor: "var(--accent-red)", color: "white", border: "none" }}
                onClick={(e) => {
                  handleDelete(selectedMessage.id, e);
                }}
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
