// https://docs.expo.dev/router/advanced/authentication/
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';

import { useSession } from '@/utilities/ctx';
import { useTranslation } from 'react-i18next';

export default function SignIn() {
    const { signOut } = useSession();
    const { t, i18n } = useTranslation();

    return (
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ThemedText
                onPress={() => {
                    signOut();
                    router.replace('/');
                }}>
                {t('sign-out.logout')}
            </ThemedText>
        </ThemedView>
    );
}
