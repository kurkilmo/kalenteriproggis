import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router, Stack } from 'expo-router';
import { StyleSheet, Pressable, Platform } from 'react-native';
import { Input } from 'react-native-elements';

import { useSession } from '@/utilities/ctx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';



export default function Register() {
    const color = useThemeColor({}, 'text');
    const { register, signIn } = useSession();
    const [username, setUsername] = useState('')
    const [displayname, setDisplayname] = useState('')
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

        if (password !== confirmPassword) {
            setError(t('register.wrongPassword'))
            return false
        }

        if (password.length < 8){
            setError(t('register.shortPassword'))
            return false
        }
        
        const ok = await register(username, password, displayname, setError)
        if (ok){
            router.replace("/sign-in")
        }
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

                <ThemedText>{t('register.displayname')}</ThemedText>
                <Input style={{ color, ...styles.input }}
                    value={displayname}
                    onChangeText={setDisplayname}
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
                
          <Pressable onPress={handleRegister} style={styles.registerButton}>
            <ThemedText>{t('register.register')}</ThemedText>
            </Pressable>
            <ThemedText
            style={styles.backToSignIn}
            onPress={() => router.push("/sign-in")}>{t('register.backToSignIn')}
            </ThemedText>
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
      borderColor: '#72B2F2',
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
    },
    backToSignIn: {
      fontSize: 16,
      color: "#72B2F2",
      textAlign: "center",
      marginTop: 12
    }
  })