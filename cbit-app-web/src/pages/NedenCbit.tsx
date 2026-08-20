import { useLanguage } from '../context/useLanguage';

export default function NedenCbit() {
  const { t } = useLanguage();
  const data = t.nedenCbitSayfasi;

  const getDegerImage = (index: number) => {
    switch (index) {
        case 0: return "/single_contact.jpg";
        case 1: return "/end_to_end.jpg";
        case 2: return "/engineering_heritage.jpg";
        default: return "/single_contact.jpg";
    }
  }

  return (
    <div className="page-container neden-cbit-page">
      {/* 1. Hero Bölümü */}
      <section className="neden-hero-section">
        <div className="neden-hero-inner">
          <h1 className="neden-hero-title">{data.hero.baslik}</h1>
          <p className="neden-hero-subtitle">{data.hero.altBaslik}</p>
        </div>
      </section>

      {/* 2. Değer Önerisi (3'lü Kart Izgarası) */}
      <section className="neden-deger-section">
        <div className="neden-deger-grid">
          {data.degerOnerisi.map((item: any, idx: number) => (
            <div key={idx} className="neden-deger-card">
              <img src={getDegerImage(idx)} alt={item.baslik} className="neden-deger-image" />
              <h3 className="deger-card-title">{item.baslik}</h3>
              <p className="deger-card-desc">{item.tanim}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Fark Yaratan Yaklaşımlarımız (6'lı Resimli Izgara) */}
      <section className="neden-fark-section">
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>{data.farkYaratanYaklasimlarimiz.baslik}</h2>
        <div className="neden-fark-grid">
          {data.farkYaratanYaklasimlarimiz.maddeler.map((item: any, idx: number) => (
            <div key={idx} className="neden-fark-card">
              <h4 className="fark-card-title">{item.baslik}</h4>
              <img src={item.img} alt={item.baslik} className="fark-card-image" />
              <p className="fark-card-desc">{item.tanim}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
