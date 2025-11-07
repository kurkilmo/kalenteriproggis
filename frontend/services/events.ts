import { API_URL } from "@/utilities/config";

// haetaan tapahtumat backendistä
export async function getEvents() {
    const url = `${API_URL}/api/me/events`
    return fetch(url, {credentials: 'include'}).then(res => res.json())
}
