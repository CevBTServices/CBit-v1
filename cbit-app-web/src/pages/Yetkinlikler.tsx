import { useLanguage } from "../context/useLanguage";

const yetkinliklerGorseller = [
  "/tr_capabilities_1.png",
  "/hero-saha-muhendisi.jpg",
  "/electrical-redundancy.png",
  "/resim.png",
  "/white-space-installation.png",
  "/akilli-isletim-dcim.jpg",
];

export default function Yetkinlikler() {
  const { t } = useLanguage();

  const maddeler = t.yetkinlikler.maddeler;
  const leftColumn = maddeler.slice(0, 3);
  const rightColumn = maddeler.slice(3, 6);

  return (
    <div className="page-container yetkinlikler-page">
      <h1 className="page-title">{t.yetkinlikler.baslik}</h1>
      <p className="page-subtitle">{t.yetkinlikler.altBaslik}</p>

      {/* Hero Görsel - Datacenter Exterior */}
      <section className="section-block solutions-hero-section mt-large">
        <figure className="solutions-hero-figure">
          <img
            src="/hero-exterior-v2.jpg"
            alt="CBIT Teknoloji - Tamamlanmış modern veri merkezi dış cephesi"
            className="solutions-hero-img"
          />
          <figcaption className="solutions-hero-caption">
            <span className="solutions-hero-tag">6 Temel Yetkinlik</span>
            <span className="solutions-hero-text">
              Tasarımdan devreye almaya, tüm disiplinlerde uçtan uca mühendislik
            </span>
          </figcaption>
        </figure>
      </section>

      {/* Two-column split layout */}
      <section className="section-block mt-large mb-large">
        <div className="split-layout">
          <div className="split-column">
            {leftColumn.map((item: any, idx: number) => (
              <div key={idx} className="split-block">
                <h3 className="split-block-title">{item.baslik}</h3>
                <div className="split-block-image">
                  <img src={yetkinliklerGorseller[idx]} alt={item.baslik} />
                </div>
                <p className="split-block-detail">{item.tanim}</p>
              </div>
            ))}
          </div>

          <div className="split-divider" />

          <div className="split-column">
            {rightColumn.map((item: any, idx: number) => (
              <div key={idx} className="split-block">
                <h3 className="split-block-title">{item.baslik}</h3>
                <div className="split-block-image">
                  <img src={yetkinliklerGorseller[idx + 3]} alt={item.baslik} />
                </div>
                <p className="split-block-detail">{item.tanim}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
