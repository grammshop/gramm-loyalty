import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="fixed top-4 right-4 flex items-center space-x-2 bg-theme-glass p-2 rounded-full shadow-md z-50 transition-colors duration-300">
      <Globe className="w-5 h-5 text-primary" />
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${i18n.language === 'en' ? 'bg-primary text-white' : 'text-theme-muted hover:bg-white hover:bg-opacity-20'}`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('ro')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${i18n.language === 'ro' ? 'bg-primary text-white' : 'text-theme-muted hover:bg-white hover:bg-opacity-20'}`}
      >
        RO
      </button>
    </div>
  );
};

export default LanguageSwitcher;
