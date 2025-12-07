/* The majority of the contents of this file are aquired from the Expo documentation
(https://docs.expo.dev/router/advanced/authentication/),
licenced under the MIT licence:
The MIT License (MIT)

Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import { useStorageState } from '@/hooks/useStorageState';
import { createContext, use, type PropsWithChildren } from 'react';
import { API_URL } from './config';

const AuthContext = createContext<{
    signIn: (u:string, p:string, setE: (e:string)=>void) => void;
    signOut: () => void;
    register: (u:string, p:string, setE: (e:string)=>void) => Promise<boolean>;
    session?: string | null;
    isLoading: boolean;

}>({
    signIn: (username: string, password: string, setError: (e:string)=>void) => null,
    signOut: () => null,
    register: async () => false,
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
        const token = "Basic " + tokenValue

        fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                Authorization: token
            },
            credentials: 'include'
        }).then((resp) => {
            if (resp.status === 200) return setSession('xxx')
            else if (resp.status === 401) {
                setError("Väärä käyttäjänimi tai salasana")
            }
        }).catch(console.log)
    }

    const register = async (username: string, password: string, setError: (e:string)=>void) => {
    try {
        const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
        });

        if (res.status === 403) {
        const data = await res.json();
        setError(`Käyttäjä '${data.username}' on jo olemassa`);
        return false;
        }

        if (res.status === 201) {
         await signIn(username, password, ()=>{})
         return true;
        }

        setError("Rekisteröinti epäonnistui");
        return false;
    } catch (err) {
        console.log(err);
        setError("Palvelinvirhe");
        return false;
        }
    }

    const signOut = () => {
        setSession(null);
    }

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                session,
                isLoading,
                register,
            }}>
            {children}
        </AuthContext.Provider>
    );
}
