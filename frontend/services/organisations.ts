import { API_URL } from '@/utilities/config'

// haetaan organisaatiot backendistä
async function getOrganisations() {
    return fetch(`${API_URL}/api/orgs`).then(res => res.json())
}

// haetaan organisaation tapahtumat backendistä
async function getOrganizationEvents(org: string) {
    return fetch(`${API_URL}/api/orgs/${org}/events`).then(res => res.json())
}

// yhden organisaatiotapahtuman tuonti käyttäjän omaan kalenteriin
async function importOrganizationEvent(org: string, event: any) {
    const res = await fetch(`${API_URL}/api/orgs/${org}/events/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // jos käytätte cookie-authia, tämä on hyödyllinen
        body: JSON.stringify({
            title: event.title,
            start: event.start,
            end: event.end,
            summary: event.summary,
            color: event.color,
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to import organization event');
    }

    return res.json();
}

export { getOrganisations, getOrganizationEvents, importOrganizationEvent }
