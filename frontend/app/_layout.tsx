import { SettingsProvider } from '@/components/SettingsContext';
import { SplashScreenController } from '@/components/splash';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import '@/locales/i18n';
import { checkLogin } from '@/services/users';
import { SessionProvider, useSession } from '@/utilities/ctx';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import 'react-native-reanimated';

export default function Root() {
  return (
    <SessionProvider>
      <SplashScreenController />
      <RootNavigator />
    </SessionProvider>
  );
}

// Järkälemäisen kokoinen lataus-spinneri
const Loader = () => {
  return (
    <ThemedView style={{ width: "100%", height: "100%"}}>
      <ActivityIndicator
        size={100}
        style={{ start: "0", top: "50%"}}
      />
    </ThemedView>
  )
}

function RootNavigator() {
  const { session, signOut } = useSession();
  const [loginIsChecked, setLoginIsChecked] = useState(false)

  useEffect(() => {
    checkLogin().then(result => {
      if (!result) signOut();
      setLoginIsChecked(true);
    })

    if (Platform.OS === 'web') {  // Päivittää selaimen title ominaisuuden
      document.title = "Kalenterisovellus"
    }
  }, [])

  const colorScheme = useColorScheme();
  return (
    <SettingsProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {loginIsChecked ? (
          <Stack>
            <StatusBar style="auto" />
            <Stack.Protected guard={!!session} >
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            </Stack.Protected>

            <Stack.Protected guard={!session} >
              <Stack.Screen name="sign-in" options={{ headerShown: false }} />
              <Stack.Screen name="register" options= {{headerShown: false}} />
            </Stack.Protected>
          </Stack>
        ) : (<Loader />)}

      </ThemeProvider>
    </SettingsProvider>
  );
}