// https://docs.expo.dev/router/advanced/authentication/
import { useStorageState } from '@/hooks/useStorageState';
import { createContext, use, type PropsWithChildren } from 'react';
import { API_URL } from './config';

const AuthContext = createContext<{
    signIn: (u:string, p:string, setE: (e:string)=>void) => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: (username: string, password: string, setError: (e:string)=>void) => null,
    signOut: () => null,
    session: null,
    isLoading: false,
});

// Use this hook to access the user info.
export function useSession() {
    const value = use(AuthContext);
    if (!value) {
        throw new Error('useSession must be wrapped in a <SessionProvider />');
    }

    return value;
}


export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');

    const signIn = async (username: string, password: string, setError: (e: string) => void) => {
        const tokenValue = btoa(`${username}:${password}`)
        const token = "Bearer " + tokenValue

        fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                Authorization: token
            }
        }).then((resp) => {
            if (resp.status === 200) return setSession('xxx')
            else if (resp.status === 401) {
                setError("Väärä käyttäjänimi tai salasana")
            }
        })
    }

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut: () => {
                    setSession(null);
                },
                session,
                isLoading,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
