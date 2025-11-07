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
    return fetch(url).then(res => res.json())
}

/*
function getGroups() {
    return groups
}

export { getGroups }

*/