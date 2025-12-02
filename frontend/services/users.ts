import { Settings } from '@/components/SettingsContext';
import { API_URL } from '@/utilities/config';

// määritellään käyttäjä-rajapinta
export interface User {
    id: number;
    username: string;
    displayname: string;
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
    let result: User = {id: -1, username: "unknown", displayname: "unknown"};
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
    let result: User = {id: -1, username: "unknown", displayname: "unknown"};
    try {
        const response = await fetch(url, {credentials: 'include'})
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        result = await response.json()
    } catch (error: any) {
        console.error(error.message);
    }
    return result
}

export async function checkLogin() {
    const url = `${API_URL}/api/me`;
    const response = await fetch(url, { credentials: 'include' });
    return response.status === 200;
}


/** ASETUKSET */

export async function fetchSettingsFromDB() {
    //const url = `http://localhost:3001/api/me/settings`
    const url = `${API_URL}/api/me/settings`
    const response = await fetch(url, {credentials: 'include'})
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
    }

    const result = (await response.json()).settings
    let json_result : Settings | undefined = undefined 
    console.log("Result", result)
    if (typeof result === 'string') {
        console.log("Result is string, converting to json")
        json_result = JSON.parse(result)
    } else {
        json_result = result
    }
    return json_result;
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

export async function patchUserDisplayname(newName: string) {
    const url = `${API_URL}/api/me/displayname`
    try {
    const response = await fetch(url, { 
        method: "PATCH", 
        credentials: 'include', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: newName })
    } )
    if (!response.ok) {
        throw new Error(`Error during patch request upon trying to save settings: ${response.status}`)
    }
    const result = await response.json()

    } catch (error: any) {
        console.error('Error during patch request upon trying to save settings:', error);
    }
}