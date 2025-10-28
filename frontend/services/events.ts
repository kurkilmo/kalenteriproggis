import { API_URL } from "@/utilities/config";

// haetaan tapahtumat backendistä
export async function getEvents() {
    const url = `${API_URL}/api/events`
    return fetch(url).then(res => res.json())
}
