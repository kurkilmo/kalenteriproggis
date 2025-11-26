import React, { createContext, useState, useEffect, useContext, PropsWithChildren, ReactNode } from 'react';
import { getLocales, getCalendars } from 'expo-localization'
import { View } from 'react-native'
import { useSession } from '@/utilities/ctx';
import { useTranslation } from 'react-i18next';


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

interface SettingsContextType {
  settings: Settings;                                          // settings, useState:sta
  setSettings: React.Dispatch<React.SetStateAction<Settings>>, // setSettings, useState:sta
}

export const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const { t, i18n } = useTranslation()
  const [settings, setSettings] = useState(initialSettings);
  const value = useSession()

  useEffect(() => {
    const fetchSettingsFromDB = async () => {
      const url = `http://localhost:3001/api/me/settings`
      try {
        //console.log("Trying to get settings");
        const response = await fetch(url, {credentials: 'include'})
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const result = await response.json()
        setSettings(result.settings);
        i18n.changeLanguage(result.settings.language)
        //console.log("Language set to", result.settings.language)
        //console.log("Fetched settings", result.settings);
      } catch (error: any) {
        console.error('Error fetching settings from DB:', error);
        setSettings(initialSettings);
      }
    };

    fetchSettingsFromDB();
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