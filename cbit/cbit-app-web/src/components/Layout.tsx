import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "../context/useLanguage";
import { useSiteAyarlari } from "../context/SiteAyarlariContext";


export default function Layout() {
  const navigate = useNavigate();
  const { lang, t, setLang } = useLanguage();
  const { ayarlar } = useSiteAyarlari();
  
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

  return (
    <div className="site-wrapper">
      <div
        className={`navbar-bg${isShrunk ? " is-shrunk scrolled" : ""}`}
      >
        <header className="navbar">
          <div
            className="logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <img src="/cbit-logo.png" alt="CBIT Logo" />
          </div>

          {/* Masaüstü nav */}
          <nav className="nav-links desktop-nav">
            <NavLink
              to="/hakkimizda"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              {t.nav.hakkimizda}
            </NavLink>
            <NavLink
              to="/neden-biz"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            > {renderWithSpacedCBIT(t.nav.cozumler)} </NavLink>
            <NavLink
              to="/cozumler"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              {t.nav.yetkinlikler}
            </NavLink>
            {ayarlar.isOrtaklariAktif && (
              <NavLink
                to="/is-ortaklari"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                {(t as any).nav.isOrtaklari}
              </NavLink>
            )}
            {ayarlar.projelerAktif && (
              <NavLink
                to="/projeler"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                {t.nav.projeler}
              </NavLink>
            )}

            {ayarlar.haberlerAktif && (
              <NavLink
                to="/haberler"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                {t.nav.haberler}
              </NavLink>
            )}
            <NavLink
              to="/iletisim"
              className={({ isActive }) => (isActive ? "active-link" : "")}
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
            onClick={() => setMenuAcik(false)}
          >
            {t.nav.hakkimizda}
          </NavLink>
          <NavLink
            to="/neden-biz"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={() => setMenuAcik(false)}
          > {renderWithSpacedCBIT(t.nav.cozumler)} </NavLink>
          <NavLink
            to="/cozumler"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={() => setMenuAcik(false)}
          >
            {t.nav.yetkinlikler}
          </NavLink>
          {ayarlar.isOrtaklariAktif && (
            <NavLink
              to="/is-ortaklari"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => setMenuAcik(false)}
            >
              {(t as any).nav.isOrtaklari}
            </NavLink>
          )}
          {ayarlar.projelerAktif && (
            <NavLink
              to="/projeler"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => setMenuAcik(false)}
            >
              {t.nav.projeler}
            </NavLink>
          )}

          {ayarlar.haberlerAktif && (
            <NavLink
              to="/haberler"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => setMenuAcik(false)}
            >
              {t.nav.haberler}
            </NavLink>
          )}
          <NavLink
            to="/iletisim"
            className={({ isActive }) => (isActive ? "active-link" : "")}
            onClick={() => setMenuAcik(false)}
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
        <div className="footer-content">
          <div className="footer-contact-info">
            <p className="contact-item">{t.footer.adres}</p>
            <p className="contact-item">{t.footer.eposta}</p>
            <p className="contact-item">{t.footer.telefon}</p>
            <p className="footer-policies">
              <NavLink to="/kisisel-verilerin-korunmasi" style={{ color: "inherit", textDecoration: "none" }} className={({ isActive }) => (isActive ? "active-link" : "")}>{(t as any).footer.aydinlatmaMetni}</NavLink>
              {" / "}
              <NavLink to="/cerez-politikasi" style={{ color: "inherit", textDecoration: "none" }} className={({ isActive }) => (isActive ? "active-link" : "")}>{(t as any).footer.cerezPolitikasi}</NavLink>
            </p>
          </div>
          <div className="footer-socials">
            <a href="https://www.linkedin.com/company/cbit-technology/home/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn" style={{ display: "inline-flex", alignItems: "center" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
