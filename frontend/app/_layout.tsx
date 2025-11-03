import { SplashScreenController } from '@/components/splash';
import { SessionProvider, useSession } from '@/utilities/ctx';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';



import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function Root() {
  return (
    <SessionProvider>
      <SplashScreenController />
      <RootNavigator />
    </SessionProvider>
  );
}

function RootNavigator() {

  const { session } = useSession();

  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <StatusBar style="auto" />
        <Stack.Protected guard={!!session} >
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!session} >
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}