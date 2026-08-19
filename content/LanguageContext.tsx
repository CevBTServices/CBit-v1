import React, { createContext, useContext, useState } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  tr: {
    // Navigation
    'nav.home': 'Ana Sayfa',
    'nav.about': 'Hakkımızda',
    'nav.solutions': 'Çözümlerimiz',
    'nav.investors': 'Yatırımcılar',
    'nav.contact': 'İletişim',
    
    // Hero Section
    'hero.title': 'Kritik Altyapılarda Mühendislik Gücü, Dijital Dönüşümde Teknoloji Vizyonu',
    'hero.subtitle': 'Cevahir Grubu\'nun 65 yılı aşan köklü mühendislik mirasını, CBIT\'in 20 yıllık teknoloji uzmanlığıyla birleştiriyoruz.',
    'hero.cta': 'Çözüm Danışmanlığı Alın',
    
    // Stats
    'stats.founded': 'Kuruluş Yılı',
    'stats.employees': 'Çalışan Sayısı',
    'stats.presence': 'Uluslararası Varlık',
    'stats.uptime': 'Hedeflenen Ağ Kullanılabilirliği',
    
    // About Section
    'about.title': 'Cevahir Grubu Mirası',
    'about.description': '1959 yılında temelleri atılan Cevahir Grubu, yarım asrı aşkın süredir barajlardan hastanelere, teknoloji kampüslerinden veri merkezlerine kadar kritik altyapı projelerinde küresel bir aktör olmuştur.',
    'about.vision': 'Vizyonumuz',
    'about.mission': 'Misyonumuz',
    'about.values': 'Değerlerimiz',
    
    // Solutions
    'solutions.title': 'Çözümlerimiz',
    'solutions.subtitle': 'Kurumunuzun ihtiyaç duyduğu her teknoloji katmanında uçtan uca hizmet sunuyoruz.',
    'solutions.datacenter': 'Ağ Altyapısı ve Veri Merkezi',
    'solutions.ai': 'Yapay Zeka Çözümleri',
    'solutions.cloud': 'Bulut Çözümleri',
    'solutions.security': 'Siber Güvenlik',
    'solutions.managed': 'Yönetilen Hizmetler',
    'solutions.consulting': 'Danışmanlık ve Proje Yönetimi',
    
    // Investors
    'investors.title': 'Yatırımcılar',
    'investors.subtitle': 'Finansal Gücü ve Teknolojik Liderliğimiz',
    'investors.growth': 'Stratejik Büyüme',
    'investors.stability': 'Finansal İstikrar',
    
    // Footer
    'footer.solutions': 'Çözümler',
    'footer.services': 'Hizmetler',
    'footer.company': 'Şirket',
    'footer.contact': 'İletişim',
    'footer.rights': 'Tüm hakları saklıdır.',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.solutions': 'Solutions',
    'nav.investors': 'Investors',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.title': 'Engineering Power in Critical Infrastructures, Technology Vision in Digital Transformation',
    'hero.subtitle': 'We combine the deep-rooted engineering heritage of the Cevahir Group, spanning over 65 years, with CBIT\'s 20 years of technological expertise.',
    'hero.cta': 'Get Solution Consulting',
    
    // Stats
    'stats.founded': 'Founded',
    'stats.employees': 'Employees',
    'stats.presence': 'International Presence',
    'stats.uptime': 'Target Network Availability',
    
    // About Section
    'about.title': 'The Cevahir Legacy',
    'about.description': 'Founded in 1959, the Cevahir Group has been a global actor in critical infrastructure projects, ranging from dams and hospitals to technology campuses and data centers, for over half a century.',
    'about.vision': 'Our Vision',
    'about.mission': 'Our Mission',
    'about.values': 'Our Values',
    
    // Solutions
    'solutions.title': 'Solutions',
    'solutions.subtitle': 'We provide end-to-end services across every technology layer your organization needs.',
    'solutions.datacenter': 'Network Infrastructure & Data Centers',
    'solutions.ai': 'AI & Data Solutions',
    'solutions.cloud': 'Cloud Solutions',
    'solutions.security': 'Cyber Security',
    'solutions.managed': 'Managed Services',
    'solutions.consulting': 'Consulting & Project Management',
    
    // Investors
    'investors.title': 'Investors',
    'investors.subtitle': 'Financial Strength and Technological Leadership',
    'investors.growth': 'Strategic Growth',
    'investors.stability': 'Financial Stability',
    
    // Footer
    'footer.solutions': 'Solutions',
    'footer.services': 'Services',
    'footer.company': 'Company',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('tr');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
