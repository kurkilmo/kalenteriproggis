import { API_URL } from '@/utilities/config'

// haetaan organisaatiot backendistä
async function getOrganisations() {
    return fetch(`${API_URL}/api/orgs`).then(res => res.json())
}

// haetaan organisaation tapahtumat backendistä
async function getOrganizationEvents(org: string) {
    return fetch(`${API_URL}/api/orgs/${org}/events`).then(res => res.json())
}

export { getOrganisations, getOrganizationEvents }
