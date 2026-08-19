import { useState } from "react";
import { useLanguage } from "../context/useLanguage";
import { api } from "../api/client";
import { Alert } from "../components/Alert"; // Zarif Alert bileşenini ekliyoruz

export default function Iletisim() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    adSoyad: "",
    eposta: "",
    konu: "",
    mesaj: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Tüm alanların dolu olduğunu kontrol ediyoruz
    if (
      !formData.adSoyad.trim() ||
      !formData.eposta.trim() ||
      !formData.konu.trim() ||
      !formData.mesaj.trim()
    ) {
      setStatus("error");
      setErrorMessage("Lütfen tüm alanları doldurunuz.");
      return;
    }

    setStatus("sending");

    api.messages
      .create(formData)
      .then(() => {
        setStatus("success");
        setFormData({ adSoyad: "", eposta: "", konu: "", mesaj: "" });
      })
      .catch((err) => {
        console.error("[MESSAGE SEND ERROR]", err);
        setStatus("error");
        setErrorMessage(t.iletisim.form.hata);
      });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ backgroundColor: "#262626", minHeight: "100vh", width: "100%" }}>
      <div className="page-container iletisim-page">
      <h1 className="page-title">{t.iletisim.baslik}</h1>
      <p className="page-subtitle">{t.iletisim.altBaslik}</p>

      <section className="section-block mt-large">
        <p className="section-lead mb-large">{t.iletisim.aciklama}</p>

        {/* Başarı veya Hata bildirimlerini modern Alert kutuları ile gösteriyoruz */}
        {status === "success" && (
          <Alert type="success" message={t.iletisim.form.basarili} />
        )}
        {status === "error" && (
          <Alert type="error" message={errorMessage || t.iletisim.form.hata} />
        )}

        <div className="grid-layout two-col gap-large">
          {/* Contact Details */}
          <div className="card contact-details-card p-large">
            <h2 className="mb-large">{t.iletisim.baslik}</h2>
            <ul className="contact-details-list mb-large">
              <li>
                <strong>{t.iletisim.sirketDetayi.adres}: </strong>
                {t.footer.adres}
              </li>
              <li>
                <strong>{t.iletisim.sirketDetayi.telefon}: </strong>
                {t.footer.telefon}
              </li>
              <li>
                <strong>{t.iletisim.sirketDetayi.eposta}: </strong>
                {t.footer.eposta}
              </li>
              <li>
                <strong>{t.iletisim.sirketDetayi.linkedin}: </strong>
                <a href="https://www.linkedin.com/company/cbit-technology/home/" target="_blank" rel="noopener noreferrer">Bizim Hesap</a>
              </li>
            </ul>

            <h3 className="mb-medium">{t.iletisim.konum}</h3>
            <div
              className="map-container"
              style={{ 
                padding: 0, 
                overflow: "hidden", 
                height: "250px",
                backgroundColor: "#262626",
                borderRadius: "12px",
                transition: "box-shadow 0.3s ease"
              }}
            >
              <iframe
                title="Google Maps"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src="https://maps.google.com/maps?q=R%C3%BCzgarl%C4%B1bah%C3%A7e%20Mah.%20%C3%87am%20P%C4%B1nar%C4%B1%20Sk.%20No%3A1%2034805%20Kavac%C4%B1k%20Ticaret%20Merkezi%20Beykoz%2F%C4%B0stanbul&t=&z=16&ie=UTF8&iwloc=&output=embed"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="card contact-form-card p-large">
            <h2>{t.iletisim.form.baslik}</h2>
            <p className="text-muted mb-large">{t.iletisim.form.altBaslik}</p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="adSoyad">{t.iletisim.form.adSoyad}</label>
                <input
                  type="text"
                  id="adSoyad"
                  name="adSoyad"
                  value={formData.adSoyad}
                  onChange={handleChange}
                  required
                  disabled={status === "sending"}
                />
              </div>

              <div className="form-group">
                <label htmlFor="eposta">{t.iletisim.form.eposta}</label>
                <input
                  type="email"
                  id="eposta"
                  name="eposta"
                  value={formData.eposta}
                  onChange={handleChange}
                  required
                  disabled={status === "sending"}
                />
              </div>

              <div className="form-group">
                <label htmlFor="konu">{t.iletisim.form.konu}</label>
                <input
                  type="text"
                  id="konu"
                  name="konu"
                  value={formData.konu}
                  onChange={handleChange}
                  required
                  disabled={status === "sending"}
                />
              </div>

              <div className="form-group">
                <label htmlFor="mesaj">{t.iletisim.form.mesaj}</label>
                <textarea
                  id="mesaj"
                  name="mesaj"
                  rows={5}
                  value={formData.mesaj}
                  onChange={handleChange}
                  required
                  disabled={status === "sending"}
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={status === "sending"}
              >
                {status === "sending"
                  ? t.iletisim.form.gonderiliyor
                  : t.iletisim.form.gonder}
              </button>
            </form>
          </div>
        </div>
      </section>


    </div>
    </div>
  );
}
