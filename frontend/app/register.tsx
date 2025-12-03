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
import { set } from 'lodash';

export default function Register() {
    const color = useThemeColor({}, 'text');
    const { register } = useSession();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('') 
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const { t, i18n } = useTranslation()

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

    const handleRegister = async () => {  
        setError('')

        /*const response = await fetch(`${process.env.API_URL}/auth/check-username`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        })

        if(response.status === 403) {
            setError("Käyttäjänimi on jo olemassa")
            return false
        }*/

        if (password !== confirmPassword) {
            setError("Salasanat eivät täsmää")
            return false
        }

        const ok = await register(username, password, setError)
        if (ok)
            router.replace("/")
    }

    return(
        <ThemedView style={styles.container}>
            <ThemedView style={styles.fieldsContainer}>
                <ThemedText>{t('register.username')}</ThemedText>
                <Input style={{ color, ...styles.input }}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize='none'
                    spellCheck={false}
                />

                <ThemedText>{t('register.password')}</ThemedText>
                <Input style={{ color, ...styles.input }}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    />

                <ThemedText>{t('register.confirm-password')}</ThemedText>
                <Input style={{ color, ...styles.input }}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={true}
                />
            </ThemedView>
                
            <ThemedText style={styles.registerButton} onPress={handleRegister}
            >{t('register.register')}</ThemedText>
            <ErrorMessage error={error} setError={setError} />
        </ThemedView>   
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  fieldsContainer: {
    width: '70%',
    maxWidth: 300,
  },
  input: {
    textAlign: 'center',
    marginBottom: 10,
  },
  registerButton: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ADD8E6',
    padding: 6,
    paddingHorizontal: 20,
    marginTop: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  errorContainer: {
    marginTop: 15,
    padding: 8,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ff6257'
  },
  errorText: {
    fontSize: 16
  }
})