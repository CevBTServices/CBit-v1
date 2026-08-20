import { useLanguage } from "../context/useLanguage";

export default function CerezPolitikasi() {
  const { t } = useLanguage();

  const icerik = (t as any).yasal?.cerezPolitikasi;

  if (!icerik) return null;

  return (
    <div className="page-container policy-page">
      <h1 className="page-title mb-large">{icerik.baslik}</h1>
      <section className="section-block bg-light p-large border-radius-medium mt-large mb-large">
        <div className="max-width-text" style={{ margin: "0 auto", textAlign: "left" }}>
          {icerik.metin.map((paragraf: string, index: number) => (
            <p key={index} className="about-paragraph mb-medium" style={{ marginBottom: "1.5rem" }}>
              {paragraf}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
