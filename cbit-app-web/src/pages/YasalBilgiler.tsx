import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import { api } from "../api/client";
import type { YasalMetin } from "../types";
import { Home, FileText } from "lucide-react";

export default function YasalBilgiler() {
  const { lang } = useLanguage();
  const [metinler, setMetinler] = useState<YasalMetin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.yasalMetinler
      .list()
      .then((data) => setMetinler(data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const baslikText = lang === "en" ? "Legal Information" : "Yasal Bilgiler";
  const aciklamaText = lang === "en" 
    ? "You can review our legal documents, terms of use and agreements below." 
    : "Sitemizdeki yasal belgeleri, kullanım kurallarını ve sözleşmeleri aşağıdan inceleyebilirsiniz.";
  const emptyText = lang === "en" 
    ? "No legal text found to display." 
    : "Gösterilecek yasal metin bulunamadı.";
  const homeText = lang === "en" ? "Home" : "Ana Sayfa";
  const viewBtnText = lang === "en" ? "View / Download Document" : "Belgeyi Görüntüle / İndir";

  const getFileUrl = (path: string) => {
    const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4101";
    if (path.startsWith("http")) return path;
    const cleanBase = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
    return `${cleanBase}${path}`;
  };

  return (
    <div className="page-container policy-page" style={{ minHeight: "60vh", padding: "40px 20px" }}>
      <div className="max-width-container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#666", fontSize: "14px", marginBottom: "20px" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "4px", color: "#d32f2f", textDecoration: "none" }}>
            <Home size={14} />
            {homeText}
          </Link>
          <span>›</span>
          <span style={{ color: "#333", fontWeight: "500" }}>{baslikText}</span>
        </div>

        {/* Header */}
        <div style={{ borderLeft: "4px solid #d32f2f", paddingLeft: "15px", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "2rem", margin: "0 0 10px 0", color: "#111" }}>{baslikText}</h1>
        </div>
        <p style={{ color: "#666", fontSize: "1.1rem", marginBottom: "40px" }}>
          {aciklamaText}
        </p>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", color: "#666", padding: "40px" }}>Yükleniyor...</div>
        ) : metinler.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", padding: "60px 20px" }}>
            {emptyText}
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "2rem" 
          }}>
            {metinler.map((m) => (
              <div key={m.id} style={{
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                backgroundColor: "#fff",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
              }}>
                <div style={{
                  backgroundColor: "rgba(227, 24, 55, 0.1)",
                  padding: "1rem",
                  borderRadius: "50%",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <FileText size={32} color="#d32f2f" />
                </div>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#111" }}>
                  {lang === "en" && m.baslikEn ? m.baslikEn : m.baslik}
                </h3>
                <p style={{ color: "#666", marginBottom: "2rem", flexGrow: 1, lineHeight: "1.5" }}>
                  {lang === "en" && m.aciklamaEn ? m.aciklamaEn : m.aciklama}
                </p>
                {m.dosyaYolu && (
                  <a 
                    href={getFileUrl(m.dosyaYolu)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      width: "100%", 
                      textAlign: "center",
                      display: "inline-block",
                      padding: "10px 20px",
                      backgroundColor: "#fff",
                      color: "#d32f2f",
                      border: "1px solid #d32f2f",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontWeight: "500",
                      transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#d32f2f";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#fff";
                      e.currentTarget.style.color = "#d32f2f";
                    }}
                  >
                    {viewBtnText}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
