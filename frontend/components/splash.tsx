// https://docs.expo.dev/router/advanced/authentication/
import { useSession } from '@/utilities/ctx';
import { SplashScreen } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
    const { isLoading } = useSession();

    if (!isLoading) {
        SplashScreen.hide();
    }

    return null;
}
