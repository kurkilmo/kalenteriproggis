import React, { createContext, useState, useEffect, useContext, PropsWithChildren, ReactNode } from 'react';
import { getLocales, getCalendars } from 'expo-localization'
import { View } from 'react-native'
import { useSession } from '@/utilities/ctx';
import { useTranslation } from 'react-i18next';
import { fetchSettingsFromDB } from '@/services/users';


export interface Settings {
    theme: 'default' | 'light' | 'dark';
    language: string
    timezone: string
}

export const initialSettings: Settings = {
    theme: 'default',
    language: getLocales()[0].languageCode ?? 'fi',
    timezone: getCalendars()[0].timeZone ?? 'Europe/Helsinki'
}

type updateSettingsFunction = (newSettings : Settings) => void;

interface SettingsContextType {
  settings: Settings;                                          // settings, useState:sta
  setSettings: updateSettingsFunction,                         // kutsuu useState:n setSettings uudella settings oliolla
}

export const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const { t, i18n } = useTranslation()
  const [settings, setSettingsState] = useState(initialSettings);
  const value = useSession()

  //console.log("Settings: ", settings, settings.language)

  const setSettings : updateSettingsFunction = (newSettings : Settings) => {
    setSettingsState({...newSettings});
  }

  useEffect(() => {
    
    const fetchSettings = async () => {
      try {
        const newSettings = await fetchSettingsFromDB();
        if (newSettings != undefined) {
          setSettings(newSettings);
          i18n.changeLanguage(newSettings.language)
        }
      } catch (error: any) {
          console.error('Error fetching settings from DB:', error);
          setSettings(initialSettings);
      }
    }
    fetchSettings()
  }, [value]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
}