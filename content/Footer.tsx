import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const { language } = useLanguage();

  const currentYear = new Date().getFullYear();

  const sections = {
    tr: {
      solutions: 'Çözümler',
      services: 'Hizmetler',
      company: 'Şirket',
      contact: 'İletişim',
      rights: 'Tüm hakları saklıdır.',
      solutionItems: [
        'Ağ Altyapısı',
        'Veri Merkezi',
        'Yapay Zeka',
        'Bulut Çözümleri',
      ],
      serviceItems: [
        'Danışmanlık',
        'Kurulum',
        'Yönetilen Hizmetler',
        'Teknik Destek',
      ],
      companyItems: [
        'Hakkımızda',
        'Kariyer',
        'Basın',
        'İş Ortakları',
      ],
      contactInfo: {
        phone: '+90 (212) 555-0123',
        email: 'info@cbit.com.tr',
        address: 'İstanbul, Türkiye',
      },
    },
    en: {
      solutions: 'Solutions',
      services: 'Services',
      company: 'Company',
      contact: 'Contact',
      rights: 'All rights reserved.',
      solutionItems: [
        'Network Infrastructure',
        'Data Centers',
        'Artificial Intelligence',
        'Cloud Solutions',
      ],
      serviceItems: [
        'Consulting',
        'Installation',
        'Managed Services',
        'Technical Support',
      ],
      companyItems: [
        'About Us',
        'Careers',
        'Press',
        'Partners',
      ],
      contactInfo: {
        phone: '+90 (212) 555-0123',
        email: 'info@cbit.com.tr',
        address: 'Istanbul, Turkey',
      },
    },
  };

  const content = language === 'tr' ? sections.tr : sections.en;

  return (
    <footer id="contact" className="bg-[#003366] text-white">
      {/* Main Footer Content */}
      <div className="container py-16 md:py-24">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#00BCD4] rounded-lg flex items-center justify-center">
                <span className="font-bold text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>C</span>
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>CBIT</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {language === 'tr'
                ? 'Kritik altyapılarda teknoloji çözümleri sunan bağımsız sistem entegratörü.'
                : 'Independent system integrator providing technology solutions for critical infrastructures.'}
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-bold mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>{content.solutions}</h4>
            <ul className="space-y-2">
              {content.solutionItems.map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-gray-300 hover:text-[#00BCD4] transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>{content.services}</h4>
            <ul className="space-y-2">
              {content.serviceItems.map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-gray-300 hover:text-[#00BCD4] transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>{content.company}</h4>
            <ul className="space-y-2">
              {content.companyItems.map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-gray-300 hover:text-[#00BCD4] transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>{content.contact}</h4>
            <div className="space-y-3">
              <a href={`tel:${content.contactInfo.phone}`} className="flex items-center gap-2 text-gray-300 hover:text-[#00BCD4] transition-colors text-sm">
                <Phone size={16} />
                {content.contactInfo.phone}
              </a>
              <a href={`mailto:${content.contactInfo.email}`} className="flex items-center gap-2 text-gray-300 hover:text-[#00BCD4] transition-colors text-sm">
                <Mail size={16} />
                {content.contactInfo.email}
              </a>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <MapPin size={16} />
                {content.contactInfo.address}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-gray-400 text-sm">
            © {currentYear} CBIT Bilgi ve İletişim Teknolojileri. {content.rights}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-300 hover:text-[#00BCD4] transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-gray-300 hover:text-[#00BCD4] transition-colors">
              <Twitter size={20} />
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="text-gray-300 hover:text-[#00BCD4] transition-colors">
              {language === 'tr' ? 'Gizlilik' : 'Privacy'}
            </a>
            <a href="#" className="text-gray-300 hover:text-[#00BCD4] transition-colors">
              {language === 'tr' ? 'Şartlar' : 'Terms'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
