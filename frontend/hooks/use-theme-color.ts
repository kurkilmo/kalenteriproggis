/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import settings, { SettingsContext } from '@/app/(drawer)/settings';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useContext, useEffect } from 'react';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const settings = useContext(SettingsContext)  // Asetukset
  const systemTheme = useColorScheme() ?? 'dark' // Järjestelmän oletus, tai tumma jos ei saa haettua

  const theme = settings.theme == 'default' ? systemTheme : settings.theme  // Valitaan joko järjestelmän oletus tai valittu teema

  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
