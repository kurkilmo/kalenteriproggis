import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { getLocales, getCalendars } from 'expo-localization'

import en from '@/locales/en.json'
import fi from '@/locales/fi.json'

let defaultLanguage

const deviceLanguage = Localization.getLocales()[0].languageCode || 'en'

console.log("Lopullinen def kieli: ", defaultLanguage)

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: deviceLanguage,      // Laitteen oletuskieli
    fallbackLng: 'en',
    debug: true,
    resources: {
        en: {
            translation: en
        },
        fi: {
            translation: fi
        }
    }

  });

export default i18n;
