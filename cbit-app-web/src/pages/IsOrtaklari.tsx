import { useLanguage } from "../context/useLanguage";

export default function IsOrtaklari() {
  const { t } = useLanguage();

  return (
    <div className="partners-page">
      {/* HERO SECTION (Sitenin Orijinal Başlık Kısmı) */}
      <section className="about-hero" style={{ paddingBottom: "48px" }}>
        <div className="about-hero-overlay" style={{ background: "none" }}>
          <div className="global-container" style={{ display: "block" }}>
            <div className="about-hero-content" style={{ textAlign: "center", maxWidth: "900px", margin: "0 auto" }}>
              <h1 className="about-hero-title" style={{ 
                color: "#FAFAFA", 
                fontSize: "3rem", 
                fontWeight: "800", 
                marginTop: "12px",
                textShadow: "0 2px 8px rgba(255, 215, 0, 0.4)" 
              }}>
                {(t as any).isOrtaklariSayfasi.hero.baslik}
              </h1>
              <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "16px" }}>
                <span style={{ 
                  color: "#CBD5E1", 
                  fontSize: "1.25rem", 
                  lineHeight: "1.6",
                  textAlign: "center",
                  textShadow: "0 1px 4px rgba(0, 0, 0, 0.4)" 
                }}>
                  {(t as any).isOrtaklariSayfasi.hero.lead}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SENİN RESMİNİN GÖRÜNECEĞİ KISIM */}
      <section className="section-global bg-light">
        <div className="global-container" style={{ display: "block", textAlign: "center", padding: "40px 20px" }}>
          <img 
            src="/resim.jpg" 
            alt="İş Ortaklarımız" 
            style={{ 
              maxWidth: "100%", 
              height: "auto", 
              borderRadius: "16px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
            }} 
          />
        </div>
      </section>
    </div>
  );
}
