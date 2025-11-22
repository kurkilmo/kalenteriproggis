/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useSettings } from '@/components/SettingsContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useContext, useEffect } from 'react';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { settings, setSettings } = useSettings()  // Asetukset
  const systemTheme = useColorScheme() ?? 'dark' // Järjestelmän oletus, tai tumma jos ei saa haettua

  let theme: 'light' | 'dark'
  if (!settings) { theme = systemTheme }  // Settings ei ole määritelty, käytä järjestelmän oletusta.
  else theme = (settings.theme === 'default') ? systemTheme : settings.theme ?? 'dark'  // Valitaan joko järjestelmän oletus tai valittu teema

  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
