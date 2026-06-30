import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { I18nManager } from 'react-native'
import * as ExpoLocalization from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import en from './locales/en.json'
import ar from './locales/ar.json'

const LANGUAGE_KEY = '@app_language'

const resources = { en: { translation: en }, ar: { translation: ar } }

const rawLocale = ExpoLocalization.getLocales?.()?.[0]?.languageTag ?? 'en'
const deviceLang = rawLocale.startsWith('ar') ? 'ar' : 'en'

export async function changeLanguage(lang: 'en' | 'ar') {
  await i18n.changeLanguage(lang)
  await AsyncStorage.setItem(LANGUAGE_KEY, lang)
  if (I18nManager.forceRTL) {
    I18nManager.forceRTL(lang === 'ar')
  } else {
    I18nManager.allowRTL(lang === 'ar')
  }
}

export async function initI18n() {
  const stored = await AsyncStorage.getItem(LANGUAGE_KEY)
  const lng = stored || deviceLang
  await i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })
  I18nManager.allowRTL(lng === 'ar')
  I18nManager.forceRTL(lng === 'ar')
  return i18n
}

export default i18n
