import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const { t, language } = useLanguage();

  return (
    <section id="home" className="relative w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/manus-storage/cbit_hero_home_7fa916d2.png"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container py-24 md:py-32 lg:py-40 flex flex-col justify-center min-h-screen">
        <div className="max-w-2xl">
          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-xl">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-[#003366] hover:bg-[#002244] text-white font-medium flex items-center gap-2"
            >
              {t('hero.cta')}
              <ArrowRight size={20} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              {language === 'tr' ? 'Daha Fazla Bilgi' : 'Learn More'}
            </Button>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="border-l-2 border-[#00BCD4] pl-4">
              <p className="text-sm text-gray-300 mb-1">{t('stats.founded')}</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>1959</p>
            </div>
            <div className="border-l-2 border-[#00BCD4] pl-4">
              <p className="text-sm text-gray-300 mb-1">{t('stats.employees')}</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>15K+</p>
            </div>
            <div className="border-l-2 border-[#00BCD4] pl-4">
              <p className="text-sm text-gray-300 mb-1">{t('stats.presence')}</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>4+</p>
            </div>
            <div className="border-l-2 border-[#00BCD4] pl-4">
              <p className="text-sm text-gray-300 mb-1">{t('stats.uptime')}</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>99.9999%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
