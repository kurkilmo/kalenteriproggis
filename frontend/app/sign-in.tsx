// https://docs.expo.dev/router/advanced/authentication/
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';

import { useSession } from '@/utilities/ctx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-gesture-handler';

const ErrorMessage = ({ error, setError }: { error: string, setError: React.Dispatch<React.SetStateAction<string>> }) => {
    if (!error) return null
    return (
        <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}
                onPress={()=>{setError('')}}
            >
                {error}
            </ThemedText>
        </ThemedView>
    )
}

export default function SignIn() {
    const color = useThemeColor({}, 'text');
    const { signIn } = useSession();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { t, i18n } = useTranslation()

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.fieldsContainer}>
                <ThemedText>{t('sign-in.username')}</ThemedText>
                <Input
                    style={{ color, ...styles.input }}
                    value={username}
                    onChangeText={setUsername}
                    spellCheck={false}
                />
                <ThemedText>{t('sign-in.password')}</ThemedText>
                <Input
                    style={{ color, ...styles.input }}
                    value={password}
                    onChangeText={setPassword}
                    spellCheck={false}
                    textContentType='password'
                    secureTextEntry={true}
                />
            </ThemedView>
            <ThemedText style={styles.loginText}
                onPress={() => {
                    signIn(username, password, setError);
                    setUsername('')
                    setPassword('')
                    router.replace('/');
                }}>
                {t('sign-in.login')}
            </ThemedText>
            <ThemedText
                style={styles.registerLink}
                onPress={() => router.push("/register")}
                    >
                    Rekisteröidy
                </ThemedText>

            <ErrorMessage error={error} setError={setError} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    fieldsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
    },
    input: {
        textAlign: 'center'
    },
    loginText: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#5da84a',
        padding: 5,
        paddingHorizontal: 15
    },
    errorContainer: {
        marginTop: 15,
        padding: 5,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderColor:"#ff6257",
        backgroundColor: "#4a0b07"
    },
    errorText: {
        fontSize: 20,
        color: "#f2918a"
    },

    registerLink: {
    marginTop: 12,
    fontSize: 16,
    color: "#5da84a",  
    textAlign: "center",
}

})