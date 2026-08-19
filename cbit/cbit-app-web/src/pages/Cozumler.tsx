import { useEffect } from "react";
import { useLanguage } from "../context/useLanguage";
import { Link, useLocation } from "react-router-dom";
import {
  Server,
  Cloud,
  Cpu,
  Shield,
  Headphones,
  ClipboardCheck,
  Database,
  ArrowRight,
  Search,
  Ruler,
  Wrench,
  Settings,
  LifeBuoy,
} from "lucide-react";

export default function Cozumler() {
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        // A slight timeout ensures the page layout is fully calculated before scrolling
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Server":
        return <Server className="solution-icon" />;
      case "Cloud":
        return <Cloud className="solution-icon" />;
      case "Cpu":
        return <Cpu className="solution-icon" />;
      case "Shield":
        return <Shield className="solution-icon" />;
      case "Headset":
      case "Headphones":
        return <Headphones className="solution-icon" />;
      case "ClipboardCheck":
        return <ClipboardCheck className="solution-icon" />;
      case "Database":
        return <Database className="solution-icon" />;
      default:
        return <Server className="solution-icon" />;
    }
  };

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case "Search":
        return <Search className="pstep-icon" />;
      case "Ruler":
        return <Ruler className="pstep-icon" />;
      case "Wrench":
        return <Wrench className="pstep-icon" />;
      case "Settings":
        return <Settings className="pstep-icon" />;
      case "LifeBuoy":
        return <LifeBuoy className="pstep-icon" />;
      default:
        return <Search className="pstep-icon" />;
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="page-container cozumler-page">


      {/* Intro Text Section Below Image */}
      <section className="cozumler-intro-section">

        <h1 className="cozumler-intro-title">{t.cozumler.hero.baslik}</h1>
        <p className="cozumler-intro-lead">{t.cozumler.hero.lead}</p>
      </section>

      {/* Chip Nav Row */}
      <section className="cozumler-chip-section">
        <div className="cozumler-chip-row">
          {t.cozumler.chips.map((chip: { id: string; label: string }, idx: number) => (
            <button
              key={idx}
              className="cozumler-chip-btn"
              onClick={() => scrollToSection(chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </section>

      {/* Solutions Blocks Section */}
      <section className="cozumler-content-section">
        <div className="cozumler-blocks-container">
          {t.cozumler.alanlar.map((alan: any, idx: number) => (
            <div key={idx} id={alan.id} className="cozumler-solution-block">
              {/* Media / Summary Box */}
              <div className="solution-block-sidebar">
                <div className="solution-icon-badge">
                  {getIcon(alan.icon)}
                </div>
                <span className="solution-num-badge">{alan.num}</span>
                <h3 className="solution-sidebar-title">{alan.baslik}</h3>

                {alan.gorsel ? (
                  <div className="solution-sidebar-image-wrap" style={{ marginTop: "24px", borderRadius: "16px", overflow: "hidden", border: "1px solid #3c3c3c" }}>
                    <img src={alan.gorsel} alt={alan.baslik} style={{ width: "100%", height: "260px", objectFit: "cover", display: "block" }} />
                  </div>
                ) : (
                  <>
                    <p className="solution-sidebar-desc">{alan.aciklama}</p>
                    {alan.kpi && (
                      <div className="solution-kpi-card">
                        <div className="solution-kpi-val">{alan.kpi.deger}</div>
                        <div className="solution-kpi-lbl">{alan.kpi.etiket}</div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Main Content Box */}
              <div className="solution-block-main">
                {alan.lead && (
                  <p className="solution-lead-text">{alan.lead}</p>
                )}

                {alan.maddeler && (
                  <ul className="solution-feature-list">
                    {alan.maddeler.map((item: any, mIdx: number) => (
                      <li key={mIdx} className="solution-feature-item">
                        <div className="feature-text">
                          <h4 className="feature-title">{item.baslik}</h4>
                          <p className="feature-desc">{item.tanim}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {/* 5 Aşamalı Süreç (Danışmanlık Çözüm Alanı) */}
                {alan.surec && (
                  <div className="solution-process-grid">
                    {alan.surec.map((step: any, sIdx: number) => (
                      <div key={sIdx} className="process-step-card">
                        <div className="process-step-header">
                          <div className="process-icon-box">
                            {getStepIcon(step.icon)}
                          </div>
                          <span className="process-step-num">{step.num}</span>
                        </div>
                        <h4 className="process-step-title">{step.baslik}</h4>
                        <p className="process-step-desc">{step.tanim}</p>
                      </div>
                    ))}
                  </div>
                )}

                {alan.btnText && alan.btnLink && (
                  <Link to={alan.btnLink} className="solution-action-btn">
                    <span>{alan.btnText}</span>
                    <ArrowRight className="btn-arrow-icon" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
