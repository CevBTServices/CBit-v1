import { useCookies } from "../context/CookieContext";
import { useLanguage } from "../context/useLanguage";

export default function CookieBanner() {
  const { hasConsented, setModalOpen, acceptAll } = useCookies();
  const { t } = useLanguage();

  if (hasConsented) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <p>{t.cookieBanner.metin}</p>
        <div className="cookie-banner-buttons">
          <button className="btn-cookie-settings" onClick={() => setModalOpen(true)}>
            {t.cookieBanner.ayarlar}
          </button>
          <button className="btn-cookie-accept" onClick={acceptAll}>
            {t.cookieBanner.izinVer}
          </button>
        </div>
      </div>
    </div>
  );
}
