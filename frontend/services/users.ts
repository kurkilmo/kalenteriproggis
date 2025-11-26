import { Settings } from '@/components/SettingsContext';
import { API_URL } from '@/utilities/config'

// määritellään käyttäjä-rajapinta
export interface User {
    id: number;
    username: string;
}

// haetaan käyttäjät backendistä
export async function getUsers() {
    const url = "http://localhost:3001/api/users"
    let result: User[] = [];
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        result = await response.json()
    } catch (error: any) {
        console.error(error.message);
    }
    return result
}

// haetaan yksittäinen käyttäjä backendistä
export async function getUser(id: number) {
    const url = `http://localhost:3001/api/users/${id}`
    let result: User = {id: -1, username: "unknown"};
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        result = await response.json()
    } catch (error: any) {
        console.error(error.message);
    }
    return result
}

// haetaan omat tiedot
export async function getMe() {
    const url = `${API_URL}/api/me`
    return fetch(url, {credentials: 'include'}).then(res => res.json())
}


/** ASETUKSET */

export async function fetchSettingsFromDB() {
    //const url = `http://localhost:3001/api/me/settings`
    const url = `${API_URL}/api/me/settings`
    const response = await fetch(url, {credentials: 'include'})
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
    }

    const result: Settings = (await response.json()).settings
    return result;
}

export async function patchSettings(key: string, value: string) {
    //const url = `http://localhost:3001/api/me/settings`
    const url = `${API_URL}/api/me/settings`
    try {
    const response = await fetch(url, { 
        method: "PATCH", 
        credentials: 'include', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: key, value: value })
    } )
    if (!response.ok) {
        throw new Error(`Error during patch request upon trying to save settings: ${response.status}`)
    }
    const result = await response.json()

    } catch (error: any) {
        console.error('Error during patch request upon trying to save settings:', error);
    }
}