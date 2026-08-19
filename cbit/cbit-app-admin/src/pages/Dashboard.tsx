import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Dashboard() {
  const [stats, setStats] = useState({ projectsCount: 0, newsCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.projeler.list(), api.haberler.list()])
      .then(([projects, news]) => {
        setStats({
          projectsCount: projects.length,
          newsCount: news.length,
        });
      })
      .catch((err) => console.error("Stats error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Yönetim Paneli</h1>
          <p className="page-subtitle">
            CBIT projesi içeriklerini buradan hızlıca yönetebilirsiniz.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Toplam Proje</span>
          <span className="stat-value">
            {loading ? "..." : stats.projectsCount}
          </span>
          <span className="stat-desc">
            Veritabanında kayıtlı aktif projeler
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Toplam Haber</span>
          <span className="stat-value">
            {loading ? "..." : stats.newsCount}
          </span>
          <span className="stat-desc">Yayınlanmış haberler ve duyurular</span>
        </div>
      </div>

      <div
        className="card-table-wrap"
        style={{ marginTop: "40px", padding: "30px" }}
      >
        <h3 style={{ marginBottom: "15px", fontFamily: "var(--font-display)" }}>
          Hızlı Başlangıç
        </h3>
        <p
          style={{
            color: "var(--text-secondary)",
            lineHeight: "1.6",
            fontSize: "0.95rem",
          }}
        >
          Sol taraftaki menüyü kullanarak projelerinizi ve haberlerinizi
          ekleyebilir, güncelleyebilir veya silebilirsiniz. Eklediğiniz tüm
          içerikler eşzamanlı olarak kullanıcıların gördüğü ana web sayfasında
          listelenecektir.
        </p>
      </div>
    </div>
  );
}
