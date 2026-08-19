import { useState, useEffect } from "react";
import { useCookies } from "../context/CookieContext";
import { useLanguage } from "../context/useLanguage";

export default function CookieModal() {
  const { isModalOpen, setModalOpen, preferences, savePreferences, rejectAll } = useCookies();
  const { t } = useLanguage();
  
  const [localPrefs, setLocalPrefs] = useState(preferences);

  useEffect(() => {
    if (isModalOpen) {
      setLocalPrefs(preferences);
    }
  }, [isModalOpen, preferences]);

  if (!isModalOpen) return null;

  const handleToggle = (key: keyof typeof preferences) => {
    setLocalPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    savePreferences(localPrefs);
  };

  return (
    <div className="cookie-modal-overlay">
      <div className="cookie-modal">
        <div className="cookie-modal-header">
          <h3>{t.cookieModal.baslik}</h3>
          <button className="cookie-modal-close" onClick={() => setModalOpen(false)}>×</button>
        </div>
        <div className="cookie-modal-body">
          <p className="cookie-modal-desc">{t.cookieModal.aciklama}</p>
          
          <div className="cookie-option">
            <div className="cookie-option-header">
              <h4>{t.cookieModal.kisiselVeriler}</h4>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={true}
                  disabled={true}
                  onChange={() => {}}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <p>{t.cookieModal.kisiselVerilerAciklama}</p>
          </div>

          <div className="cookie-option">
            <div className="cookie-option-header">
              <h4>{t.cookieModal.cerezPolitikasi}</h4>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={localPrefs.cerezPolitikasi}
                  onChange={() => handleToggle("cerezPolitikasi")}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <p>{t.cookieModal.cerezPolitikasiAciklama}</p>
          </div>
        </div>

        <div className="cookie-modal-footer">
          <button className="btn-cookie-reject" onClick={rejectAll}>
            {t.cookieModal.tumunuReddet}
          </button>
          <button className="btn-cookie-save" onClick={handleSave}>
            {t.cookieModal.kaydet}
          </button>
        </div>
      </div>
    </div>
  );
}
