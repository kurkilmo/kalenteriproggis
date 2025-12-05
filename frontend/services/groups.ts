import { API_URL } from "@/utilities/config";

// { "id": 1, "name": "kallet", "members": [1, 5, 7] }
export interface Group {
    "id": number;
    "name": string;
    "members": number[];
}

// haetaan ryhmät backendistä
export async function getGroups() {
    const url = `${API_URL}/api/me/groups`
    return fetch(url, { credentials: 'include' }).then(res => res.json())
}

// haetaan ryhmän tapahtumat backendistä
export async function getGroupEvents(groupId: number | string) {
    const url = `${API_URL}/api/groups/${groupId}/events`
    return fetch(url, { credentials: 'include' }).then(res => res.json())
}

export async function getGroupById(groupId: number | string) {
    const url = `${API_URL}/api/groups/${groupId}/`
    return fetch(url, { credentials: 'include' }).then(res => res.json())
}
// haetaan ryhmän jäsenten ulkopuoliset varatut ajat
export async function getGroupExternalBusy(groupId: number | string) {
    const url = `${API_URL}/api/groups/${groupId}/external-busy`;
    return fetch(url, { credentials: "include" }).then(res => res.json());
}

export async function createGroup(name: string) {
    const url = `${API_URL}/api/groups/`
    return fetch(url, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    })
}

export async function deleteGroup(groupId: number | string) {
    const url = `${API_URL}/api/groups/${groupId}`
    return fetch(url, {
        method: "DELETE", credentials: "include"
    })
}

export async function leaveGroup(groupId: number | string) {
    const url = `${API_URL}/api/me/groups/${groupId}`
    return fetch(url, {
        method: "DELETE", credentials: "include"
    })
}