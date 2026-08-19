import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  ClipboardCheck,
  Cloud,
  Compass,
  Cpu,
  Gauge,
  Headphones,
  Server,
  Shield,
  Target,
} from "lucide-react";
import { useLanguage } from "../context/useLanguage";
import { useSiteAyarlari } from "../context/SiteAyarlariContext";


const solutionIcons = [
  Cloud,
  Server,
  Shield,
  Cpu,
  Headphones,
  ClipboardCheck,
];

const whyUsIcons = [
  Gauge,
  Award,
  Compass,
  Target,
];


export default function Anasayfa() {
  const { t } = useLanguage();
  const { ayarlar } = useSiteAyarlari();

  return (
    <div className="home-page">

      {/* 1. HERO SECTION */}
      <section className="main-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-grid-2">
              <div className="hero-left-side">
                <h1>{t.anasayfa.hero.baslik}</h1>
                <p className="hero-subtext">{t.anasayfa.hero.aciklama}</p>
                <div className="hero-actions">
                  <Link to="/cozumler" className="btn-primary">
                    {t.anasayfa.hero.ctaCozumler}
                  </Link>
                  <Link to="/neden-biz" className="btn-secondary">
                    {t.anasayfa.hero.ctaNedenBiz}
                  </Link>
                  <Link to="/iletisim" className="btn-outline">
                    {t.anasayfa.hero.ctaIletisim}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 4. ÇÖZÜMLERİMİZ (6 KART) */}
      <section className="section-global">
        <div className="global-container" style={{ display: "block" }}>
          <div className="services-summary-header">

            <h2 className="section-title">{t.anasayfa.cozumler.baslik}</h2>
            <p className="section-lead">{t.anasayfa.cozumler.aciklama}</p>
          </div>

          <div className="solution-cards-grid">
            {t.anasayfa.cozumler.liste.map((item, idx) => {
              const IconComp = solutionIcons[idx] || Server;
              return (
                <div
                  key={idx}
                  className="solution-card"
                >
                  <div>
                    <div className="solution-card-top">
                      <div className="solution-icon-box">
                        <IconComp size={24} />
                      </div>
                      <span className="solution-number">{item.no}</span>
                    </div>
                    <h3>{item.baslik}</h3>
                    <p>{item.tanim}</p>
                  </div>
                  <div>
                    <Link to={item.link} className="solution-link">
                      {item.linkText} <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* 6. NEDEN CBIT? (01-04 KARTLAR) */}
      <section className="section-global why-us-section">
        <div className="global-container why-us-container">
          <div className="why-us-header">
            <span className="why-us-subtitle">{t.anasayfa.nedenCbit.eyebrow}</span>
            <h2 className="why-us-title">{t.anasayfa.nedenCbit.baslik}</h2>
            <p className="section-lead" style={{ marginTop: "12px" }}>
              {t.anasayfa.nedenCbit.aciklama}
            </p>
          </div>
          <div className="why-us-main-layout">
            <div className="why-us-grid">
              {t.anasayfa.nedenCbit.maddeler.map((item, idx) => {
                const IconComp = whyUsIcons[idx] || Compass;
                return (
                  <div key={idx} className="card why-us-card">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div className="why-us-number">{item.no}</div>
                      <IconComp size={24} color="#AC0000" />
                    </div>
                    <h3>{item.baslik}</h3>
                    <p>{item.tanim}</p>
                  </div>
                );
              })}
            </div>
            <div className="why-us-image-side">
              <div className="why-us-image-wrapper">
                <img
                  src="/neden-cbit-hero.jpg"
                  alt="CBIT Neden Biz"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/hero.png";
                  }}
                />
                <div className="image-overlay-accent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJELER VİTRİN BÖLÜMÜ — yalnızca projelerAktif=true ise gösterilir */}
      {ayarlar.projelerAktif && (
        <section className="section-global">
          <div className="global-container" style={{ display: "block" }}>
            <div className="projects-showcase-header">
              <h2 className="section-title">{t.anasayfa.projelerVitrin.baslik}</h2>
              <p className="section-lead" style={{ marginTop: "12px" }}>
                {t.anasayfa.projelerVitrin.aciklama}
              </p>
            </div>

            <div
              className="projects-showcase-image-wrap"
              style={{
                marginTop: "32px",
                borderRadius: "24px",
                overflow: "hidden",
              }}
            >
              <img
                src="/projeler-katalog.png"
                alt="CBIT Projeler Katalog"
                style={{
                  width: "100%",
                  maxHeight: "650px",
                  objectFit: "cover",
                  borderRadius: "24px",
                }}
              />
            </div>

            <div style={{ marginTop: "36px", textAlign: "center" }}>
              <Link
                to="/projeler"
                className="btn-primary"
                style={{ display: "inline-block", padding: "14px 36px", fontSize: "16px" }}
              >
                {t.anasayfa.projelerVitrin.btnText}
              </Link>
            </div>
          </div>
        </section>
      )}


    </div>
  );
}
