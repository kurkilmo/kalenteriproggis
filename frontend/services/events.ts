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

export async function deleteEvent(event) {
    const url = event.is_group_event
        ? `${API_URL}/api/groups/${event.owner_id}/events/${event.id}`
        : `${API_URL}/api/me/events/${event.id}`;

    await fetch(url, {
        method: "DELETE", credentials: "include"
    })
}

export async function editEvent(event) {
    const url = event.is_group_event
        ? `${API_URL}/api/groups/${event.owner_id}/events/${event.id}`
        : `${API_URL}/api/me/events/${event.id}`;
    await fetch(url, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(event)
    })
}