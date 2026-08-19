import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, Shield, Globe, Zap } from 'lucide-react';

export default function InvestorsSection() {
  const { language } = useLanguage();

  const metrics = [
    {
      icon: TrendingUp,
      tr: { label: 'Stratejik Büyüme', value: 'Yıllık %25+' },
      en: { label: 'Strategic Growth', value: 'YoY 25%+' },
    },
    {
      icon: Shield,
      tr: { label: 'Finansal İstikrar', value: 'Cevahir Grubu Desteği' },
      en: { label: 'Financial Stability', value: 'Cevahir Group Backing' },
    },
    {
      icon: Globe,
      tr: { label: 'Küresel Varlık', value: '4+ Ülkede Operasyon' },
      en: { label: 'Global Presence', value: 'Operations in 4+ Countries' },
    },
    {
      icon: Zap,
      tr: { label: 'Teknoloji Liderliği', value: 'Agentic AI & Cloud' },
      en: { label: 'Tech Leadership', value: 'Agentic AI & Cloud' },
    },
  ];

  const roadmap = [
    {
      tr: { title: 'Yeşil Veri Merkezleri', desc: 'LEED Platinum Sertifikasyonu' },
      en: { title: 'Green Data Centers', desc: 'LEED Platinum Certification' },
    },
    {
      tr: { title: 'Agentic AI', desc: 'Otonom Proses Yönetimi' },
      en: { title: 'Agentic AI', desc: 'Autonomous Process Management' },
    },
    {
      tr: { title: 'Küresel Genişleme', desc: 'EMEA Bölgesinde Yeni Pazarlar' },
      en: { title: 'Global Expansion', desc: 'New Markets in EMEA Region' },
    },
    {
      tr: { title: 'Siber Dayanıklılık', desc: 'Yeni Nesil SOC Otomasyonu' },
      en: { title: 'Cyber Resilience', desc: 'Next-Gen SOC Automation' },
    },
  ];

  return (
    <section id="investors" className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {language === 'tr' ? 'Yatırımcılar' : 'Investors'}
          </h2>
          <p className="text-lg text-gray-700">
            {language === 'tr'
              ? 'CBIT, Cevahir Grubu\'nun finansal gücü ve 65 yıllık sektör tecrübesiyle desteklenen, teknoloji sektöründe sürdürülebilir büyüme odaklı bir yatırım profilidir.'
              : 'CBIT is an investment profile focused on sustainable growth in the technology sector, backed by the financial strength and 65 years of industry experience of the Cevahir Group.'}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            const content = language === 'tr' ? metric.tr : metric.en;
            return (
              <div
                key={idx}
                className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <Icon className="w-8 h-8 text-[#00BCD4] mb-4" />
                <p className="text-sm text-gray-600 mb-2">{content.label}</p>
                <p className="font-bold text-lg text-[#003366]" style={{ fontFamily: "'Montserrat', sans-serif" }}>{content.value}</p>
              </div>
            );
          })}
        </div>

        {/* Innovation Roadmap */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-[#003366] mb-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {language === 'tr' ? 'İnovasyon Yol Haritası' : 'Innovation Roadmap'}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {roadmap.map((item, idx) => {
              const content = language === 'tr' ? item.tr : item.en;
              return (
                <div
                  key={idx}
                  className="p-6 bg-gradient-to-br from-[#003366]/5 to-[#00BCD4]/5 rounded-lg border border-[#00BCD4]/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#00BCD4] flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#003366] mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {content.title}
                      </h4>
                      <p className="text-gray-600">{content.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Investment Highlights */}
        <div className="p-8 bg-gradient-to-r from-[#003366] to-[#004D99] rounded-lg text-white">
          <h3 className="font-bold text-2xl mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {language === 'tr' ? 'Neden CBIT\'e Yatırım Yapmalısınız?' : 'Why Invest in CBIT?'}
          </h3>
          <ul className="grid md:grid-cols-2 gap-6">
            {[
              {
                tr: 'Cevahir Grubu\'nun 65 yıllık finansal gücü ve itibarı',
                en: '65 years of financial strength and reputation of Cevahir Group',
              },
              {
                tr: 'Kritik altyapı sektöründe kanıtlanmış uzmanlık',
                en: 'Proven expertise in critical infrastructure sector',
              },
              {
                tr: 'Agentic AI ve yeşil veri merkezi teknolojilerine stratejik yatırım',
                en: 'Strategic investments in Agentic AI and green data center technologies',
              },
              {
                tr: 'Küresel pazarlarda hızlı genişleme potansiyeli',
                en: 'Rapid expansion potential in global markets',
              },
            ].map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-[#00BCD4] font-bold">✓</span>
                <span>{language === 'tr' ? item.tr : item.en}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
