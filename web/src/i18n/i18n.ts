import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import ar from './locales/ar.json'

const resources = { en: { translation: en }, ar: { translation: ar } }

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'app_language',
    },
  })

const savedLang = localStorage.getItem('app_language') || 'en'
document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
document.documentElement.lang = savedLang

export function changeLanguage(lang: 'en' | 'ar') {
  i18n.changeLanguage(lang)
  localStorage.setItem('app_language', lang)
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lang
}

export default i18n
