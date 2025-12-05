import { API_URL } from "@/utilities/config";

// haetaan tapahtumat backendistä
export async function getEvents() {
    const url = `${API_URL}/api/me/events`
    return fetch(url, {credentials: 'include'}).then(res => res.json())
}

export async function createUserEvent(newEvent: Object) {
    const url = `${API_URL}/api/me/events`
    await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "Application/json"},
        body: JSON.stringify(newEvent)
    })
}

export async function createGroupEvent(groupId: number | string, newEvent: Object) {
    const url = `${API_URL}/api/groups/${groupId}/events`
    await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(newEvent)
    })
}