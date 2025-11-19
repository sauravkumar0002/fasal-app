import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from '../locales/en.json';
import hiTranslations from '../locales/hi.json';

// Only initialize on client side to avoid SSR issues
if (typeof window !== 'undefined') {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: enTranslations },
        hi: { translation: hiTranslations },
      },
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
} else {
  // Server-side: create a minimal i18n instance
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: enTranslations },
        hi: { translation: hiTranslations },
      },
      fallbackLng: 'en',
      lng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;


