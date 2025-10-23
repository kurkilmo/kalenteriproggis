import { API_URL } from "@/utilities/config";

export async function getEvents() {
    const url = `${API_URL}/api/events`
    return fetch(url).then(res => res.json())
}
