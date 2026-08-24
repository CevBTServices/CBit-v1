import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "../context/useLanguage";
import { useSiteAyarlari } from "../context/SiteAyarlariContext";
import { useCookies } from "../context/CookieContext";
import CookieBanner from "./CookieBanner";
import CookieModal from "./CookieModal";
export default function Layout() {
  // navigate removed
  const { lang, t, setLang } = useLanguage();
  const { ayarlar } = useSiteAyarlari();
  const { setModalOpen } = useCookies();
  
  const renderWithSpacedCBIT = (text: string) => {
    if (!text || typeof text !== 'string') return text;
    const parts = text.split('CBIT');
    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && <span className="spaced-cbit">CBIT</span>}
          </span>
        ))}
      </>
    );
  };

  const [menuAcik, setMenuAcik] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleResize = () => {
      // Ekran genişliği masaüstü kırılımına (1100px) ulaştığında mobil menüyü zorla kapatıyoruz
      if (window.innerWidth > 1100) {
        setMenuAcik(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dropdown dışına tıklandığında menüyü kapatma
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hysteresis tampon eşikli scroll listener: 120px aşağı kaydırılmadan küçülmez, 40px üstüne çıkmadan büyümez
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY || document.documentElement.scrollTop;
          if (currentScroll > 120) {
            setIsShrunk(true);
          } else if (currentScroll < 40) {
            setIsShrunk(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleNavClick = (path: string) => {
    if (window.location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMobileNavClick = (path: string) => {
    if (window.location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setMenuAcik(false);
  };

  return (
    <div className="site-wrapper">
      <div
        className={`navbar-bg${isShrunk ? " is-shrunk scrolled" : ""}`}
      >
        <header className="navbar">
          <div
            className="logo"
            onClick={() => {
              window.location.href = "/";
            }}
            style={{ cursor: "pointer" }}
          >
            <img src="/cbit-logo.png" alt="CBIT Logo" />
          </div>

          {/* Masaüstü nav */}
          <nav className="nav-links desktop-nav">
            <NavLink
              to="/hakkimizda"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => handleNavClick("/hakkimizda")}
            >
              {t.nav.hakkimizda}
            </NavLink>
            <NavLink
              to="/neden-biz"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => handleNavClick("/neden-biz")}
            > {renderWithSpacedCBIT(t.nav.cozumler)} </NavLink>
            <NavLink
              to="/cozumler"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => handleNavClick("/cozumler")}
            >
              {t.nav.yetkinlikler}
            </NavLink>
            {ayarlar.isOrtaklariAktif && (
              <NavLink
                to="/is-ortaklari"
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={() => handleNavClick("/is-ortaklari")}
              >
                {(t as any).nav.isOrtaklari}
              </NavLink>
            )}
            {ayarlar.projelerAktif && (
              <NavLink
                to="/projeler"
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={() => handleNavClick("/projeler")}
              >
                {t.nav.projeler}
              </NavLink>
            )}

            {ayarlar.haberlerAktif && (
              <NavLink
                to="/haberler"
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={() => handleNavClick("/haberler")}
              >
                {t.nav.haberler}
              </NavLink>
            )}
            <NavLink
              to="/iletisim"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => handleNavClick("/iletisim")}
            >
              {t.nav.iletisim}
            </NavLink>

            {/* Dünya İkonlu Dil Seçim Menüsü */}
            <div className="lang-dropdown-wrapper" ref={langMenuRef}>
              <button
                type="button"
                className="lang-dropdown-btn"
                onClick={() => setIsLangOpen(!isLangOpen)}
                aria-label="Dil Seçimi"
              >
                <Globe size={19} />
                <span className="lang-text">{lang.toUpperCase()}</span>
                <ChevronDown size={14} className={`lang-chevron ${isLangOpen ? "open" : ""}`} />
              </button>
              {isLangOpen && (
                <div className="lang-dropdown-menu">
                  <button
                    type="button"
                    className={`lang-dropdown-item ${lang === "tr" ? "active" : ""}`}
                    onClick={() => {
                      setLang("tr");
                      setIsLangOpen(false);
                    }}
                  >
                    <span>TR - Türkçe</span>
                  </button>
                  <button
                    type="button"
                    className={`lang-dropdown-item ${lang === "en" ? "active" : ""}`}
                    onClick={() => {
                      setLang("en");
                      setIsLangOpen(false);
                    }}
                  >
                    <span>EN - English</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Hamburger butonu */}
          <button
            className="hamburger"
            onClick={() => setMenuAcik(!menuAcik)}
            aria-label="Menü"
          >
            <span className={`hamburger-line ${menuAcik ? "open" : ""}`} />
            <span className={`hamburger-line ${menuAcik ? "open" : ""}`} />
            <span className={`hamburger-line ${menuAcik ? "open" : ""}`} />
          </button>
        </header>

        {/* Mobil menü */}
        <nav className={`mobile-nav ${menuAcik ? "open" : ""}`}>
          <NavLink
            to="/hakkimizda"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={() => handleMobileNavClick("/hakkimizda")}
          >
            {t.nav.hakkimizda}
          </NavLink>
          <NavLink
            to="/neden-biz"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={() => handleMobileNavClick("/neden-biz")}
          > {renderWithSpacedCBIT(t.nav.cozumler)} </NavLink>
          <NavLink
            to="/cozumler"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={() => handleMobileNavClick("/cozumler")}
          >
            {t.nav.yetkinlikler}
          </NavLink>
          {ayarlar.isOrtaklariAktif && (
            <NavLink
              to="/is-ortaklari"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => handleMobileNavClick("/is-ortaklari")}
            >
              {(t as any).nav.isOrtaklari}
            </NavLink>
          )}
          {ayarlar.projelerAktif && (
            <NavLink
              to="/projeler"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => handleMobileNavClick("/projeler")}
            >
              {t.nav.projeler}
            </NavLink>
          )}

          {ayarlar.haberlerAktif && (
            <NavLink
              to="/haberler"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => handleMobileNavClick("/haberler")}
            >
              {t.nav.haberler}
            </NavLink>
          )}
          <NavLink
            to="/iletisim"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={() => handleMobileNavClick("/iletisim")}
          >
            {t.nav.iletisim}
          </NavLink>
          <div className="mobile-lang">
            <button
              type="button"
              className={`mobile-lang-btn ${lang === "tr" ? "active" : ""}`}
              onClick={() => {
                setLang("tr");
                setMenuAcik(false);
              }}
            >
              <Globe size={16} style={{ marginRight: 6 }} /> TR - Türkçe
            </button>
            <button
              type="button"
              className={`mobile-lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => {
                setLang("en");
                setMenuAcik(false);
              }}
            >
              <Globe size={16} style={{ marginRight: 6 }} /> EN - English
            </button>
          </div>
        </nav>
      </div>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <img src="/cbit-logo.png" alt="CBIT Logo" />
            </div>
            <a href="https://www.linkedin.com/company/cbit-technology/home/" target="_blank" rel="noopener noreferrer" className="linkedin-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
              {(t as any).footer.takipEdin}
              <div className="linkedin-dot"></div>
            </a>
          </div>

          <div className="footer-col links-col">
            <h4>{(t as any).footer.kurumsal}</h4>
            <ul className="footer-links">
              <li><NavLink to="/hakkimizda">{t.nav.hakkimizda}</NavLink></li>
              <li><NavLink to="/neden-biz">{t.nav.cozumler}</NavLink></li>
              {ayarlar.kariyerAktif && (
                <li><a href="https://www.linkedin.com/company/cbit-technology/home/" target="_blank" rel="noopener noreferrer">Kariyer</a></li>
              )}
              {ayarlar.haberlerAktif && (
                <li><NavLink to="/haberler">{t.nav.haberler}</NavLink></li>
              )}
              <li><NavLink to="/iletisim">{t.nav.iletisim}</NavLink></li>
            </ul>
          </div>

          <div className="footer-col links-col">
            <h4>{(t as any).footer.cozumler}</h4>
            <ul className="footer-links">
              <li><NavLink to="/cozumler#sunucu-bulut">{(t as any).footer.cozumlerListesi.sunucu}</NavLink></li>
              <li><NavLink to="/cozumler#depolama">{(t as any).footer.cozumlerListesi.depolama}</NavLink></li>
              <li><NavLink to="/cozumler#veri-merkezi">{(t as any).footer.cozumlerListesi.ag}</NavLink></li>
              <li><NavLink to="/cozumler#yapay-zeka">{(t as any).footer.cozumlerListesi.yapayZeka}</NavLink></li>
            </ul>
          </div>

          <div className="footer-col contact-col">
            <h4>{(t as any).footer.iletisimBaslik}</h4>
            <p className="footer-contact-item">{(t as any).footer.adres}</p>
            <p className="footer-contact-item">{(t as any).footer.eposta}</p>
            <p className="footer-contact-item">{(t as any).footer.telefon}</p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>© {new Date().getFullYear()} CBIT Technology. All rights reserved.</p>
          </div>
          <div className="footer-bottom-right">
            <NavLink to="/yasal-bilgiler">{(t as any).footer.yasalBilgiler}</NavLink> | 
            <button className="btn-cookie-trigger" onClick={() => setModalOpen(true)}>
              {(t as any).footer.cerezAyarlari}
            </button>
          </div>
        </div>
      </footer>

      <CookieBanner />
      <CookieModal />
    </div>
  );
}
