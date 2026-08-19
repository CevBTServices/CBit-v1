import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  const { language } = useLanguage();

  const values = [
    {
      tr: { title: 'Güvenilirlik', desc: '65 yıllık itibarımızı her projede koruyoruz.' },
      en: { title: 'Reliability', desc: 'Preserving our 65-year reputation in every project.' },
    },
    {
      tr: { title: 'İnovasyon', desc: 'Agentic AI ve yeni nesil bulut teknolojilerine öncülük ediyoruz.' },
      en: { title: 'Innovation', desc: 'Leading Agentic AI and next-gen cloud technologies.' },
    },
    {
      tr: { title: 'Çözüm Odaklılık', desc: 'Karmaşık sorunlara üretici bağımsız, esnek çözümler üretiyoruz.' },
      en: { title: 'Solution Oriented', desc: 'Creating flexible, vendor-neutral solutions for complex problems.' },
    },
    {
      tr: { title: 'Etik İlkeler', desc: 'Şeffaflık ve dürüstlük, kurumsal kimliğimizin temelidir.' },
      en: { title: 'Ethical Principles', desc: 'Transparency and honesty are the foundation of our corporate identity.' },
    },
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {language === 'tr' ? 'Cevahir Grubu Mirası' : 'The Cevahir Legacy'}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {language === 'tr'
              ? '1959 yılında temelleri atılan Cevahir Grubu, yarım asrı aşkın süredir barajlardan hastanelere, teknoloji kampüslerinden veri merkezlerine kadar kritik altyapı projelerinde küresel bir aktör olmuştur.'
              : 'Founded in 1959, the Cevahir Group has been a global actor in critical infrastructure projects, ranging from dams and hospitals to technology campuses and data centers, for over half a century.'}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {values.map((value, idx) => {
            const content = language === 'tr' ? value.tr : value.en;
            return (
              <div key={idx} className="flex gap-4 p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <CheckCircle2 className="w-6 h-6 text-[#00BCD4] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-[#003366] mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {content.title}
                  </h3>
                  <p className="text-gray-600">{content.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="p-8 bg-gradient-to-br from-[#003366] to-[#004D99] rounded-lg text-white">
            <h3 className="font-bold text-2xl mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {language === 'tr' ? 'Vizyonumuz' : 'Our Vision'}
            </h3>
            <p className="leading-relaxed">
              {language === 'tr'
                ? 'Ulusal ve uluslararası pazarlarda dünya standartlarında projeler üreten; güven, kalıcılık ve geleceğe güçlenerek taşınan bir marka olmak.'
                : 'To be a brand that produces world-class projects in national and international markets, carrying trust, permanence, and strength into the future.'}
            </p>
          </div>

          {/* Mission */}
          <div className="p-8 bg-gradient-to-br from-[#00BCD4] to-[#0099CC] rounded-lg text-white">
            <h3 className="font-bold text-2xl mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {language === 'tr' ? 'Misyonumuz' : 'Our Mission'}
            </h3>
            <p className="leading-relaxed">
              {language === 'tr'
                ? 'Üstlendiğimiz her sorumlulukla Türkiye\'nin gelişmesine katkıda bulunmak; paydaşlarımız için sürdürülebilir katma değer yaratmak.'
                : 'To contribute to Turkey\'s development with every responsibility we undertake; to create sustainable value for our stakeholders.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
