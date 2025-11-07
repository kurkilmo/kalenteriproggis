// https://docs.expo.dev/router/advanced/authentication/
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';

import { useSession } from '@/utilities/ctx';

export default function SignIn() {
    const { signOut } = useSession();
    console.log("paskaa")
    return (
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ThemedText
                onPress={() => {
                    signOut();
                    router.replace('/');
                }}>
                Kirjaudu ulos
            </ThemedText>
        </ThemedView>
    );
}
