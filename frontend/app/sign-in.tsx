// https://docs.expo.dev/router/advanced/authentication/
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';

import { useSession } from '@/utilities/ctx';

export default function SignIn() {
    const { signIn } = useSession();
    console.log("paskaa")
    return (
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ThemedText
                onPress={() => {
                    signIn();
                    // Navigate after signing in. You may want to tweak this to ensure sign-in is successful before navigating.
                    router.replace('/');
                }}>
                Kirjaudu sisään
            </ThemedText>
        </ThemedView>
    );
}
