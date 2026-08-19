import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function SolutionsSection() {
  const { language } = useLanguage();

  const solutions = [
    {
      key: 'datacenter',
      image: '/manus-storage/cbit_datacenter_1e9d755c.png',
      tr: {
        title: 'Ağ Altyapısı ve Veri Merkezi',
        desc: 'Kampüs ağlarından geniş alan ağlarına, sunucu ve depolama sistemlerinden sanallaştırma katmanlarına kadar her aşamada %99.9999 erişilebilirlik hedefliyoruz.',
      },
      en: {
        title: 'Network Infrastructure & Data Centers',
        desc: 'From campus networks to Wide Area Networks, and from server and storage systems to virtualization layers, we target 99.9999% availability at every stage.',
      },
    },
    {
      key: 'ai',
      image: '/manus-storage/cbit_ai_solutions_b895bf36.png',
      tr: {
        title: 'Yapay Zeka Çözümleri',
        desc: 'Agentic AI çözümlerimizle, yapay zekanın iş süreçlerinizde otonom aksiyonlar almasını sağlıyor; veri olgunlaştırma hizmetlerimizle operasyonel verimlilikte %40\'a varan artış hedefliyoruz.',
      },
      en: {
        title: 'AI & Data Solutions',
        desc: 'With our Agentic AI solutions, we enable AI to take autonomous actions in your business processes; we aim for up to 40% increase in operational efficiency.',
      },
    },
    {
      key: 'cloud',
      image: '/manus-storage/cbit_green_datacenter_95c4ef87.png',
      tr: {
        title: 'Bulut Çözümleri',
        desc: 'Hibrit ve çoklu bulut stratejilerimizle, iş yüklerinizi performans ve maliyet açısından en optimize platformlara taşıyoruz. %30\'a varan altyapı maliyet tasarrufu hedefliyoruz.',
      },
      en: {
        title: 'Cloud Solutions',
        desc: 'With our hybrid and multi-cloud strategies, we migrate your workloads to the most optimized platforms. We aim for up to 30% infrastructure cost savings.',
      },
    },
    {
      key: 'security',
      image: '/manus-storage/cbit_managed_services_3e7bbd98.png',
      tr: {
        title: 'Siber Güvenlik',
        desc: '7/24 hizmet veren Güvenlik Operasyon Merkezimiz (SOC) ve proaktif tehdit izleme sistemlerimizle kurumunuzu uçtan uca koruyoruz.',
      },
      en: {
        title: 'Cyber Security',
        desc: 'We protect your organization end-to-end with our 24/7 Security Operations Center (SOC) and proactive threat monitoring systems.',
      },
    },
  ];

  return (
    <section id="solutions" className="py-20 md:py-32 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {language === 'tr' ? 'Çözümlerimiz' : 'Our Solutions'}
          </h2>
          <p className="text-lg text-gray-700">
            {language === 'tr'
              ? 'Kurumunuzun ihtiyaç duyduğu her teknoloji katmanında uçtan uca hizmet sunuyoruz.'
              : 'We provide end-to-end services across every technology layer your organization needs.'}
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((solution, idx) => {
            const content = language === 'tr' ? solution.tr : solution.en;
            return (
              <Card
                key={solution.key}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={solution.image}
                    alt={content.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-xl text-[#003366] mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {content.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {content.desc}
                  </p>
                  <div className="flex items-center text-[#00BCD4] font-medium hover:gap-2 transition-all">
                    {language === 'tr' ? 'Detaylar' : 'Learn More'}
                    <ArrowRight size={18} className="ml-2" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
