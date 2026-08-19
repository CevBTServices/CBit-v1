import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'nav.home', href: '#home' },
    { key: 'nav.about', href: '#about' },
    { key: 'nav.solutions', href: '#solutions' },
    { key: 'nav.investors', href: '#investors' },
    { key: 'nav.contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#003366] to-[#00BCD4] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>C</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-[#003366]" style={{ fontFamily: "'Montserrat', sans-serif" }}>CBIT</h1>
            <p className="text-xs text-gray-600">Teknoloji Çözümleri</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className="text-sm font-medium text-gray-700 hover:text-[#003366] transition-colors"
            >
              {language === 'tr' ? item.key.split('.')[1] : item.key.split('.')[1]}
            </a>
          ))}
        </nav>

        {/* Language Toggle & CTA */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLanguage('tr')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                language === 'tr'
                  ? 'bg-white text-[#003366] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              TR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                language === 'en'
                  ? 'bg-white text-[#003366] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              EN
            </button>
          </div>

          <Button
            className="hidden sm:inline-flex bg-[#003366] hover:bg-[#002244] text-white"
            size="sm"
          >
            {language === 'tr' ? 'İletişim' : 'Contact'}
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="container py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-[#003366] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === 'tr' ? item.key.split('.')[1] : item.key.split('.')[1]}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
