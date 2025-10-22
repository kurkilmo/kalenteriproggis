import { API_URL } from '@/utilities/config'

async function getOrganisations() {
    console.log("getting orgs")
    console.log(API_URL)
    return fetch(`${API_URL}/api/orgs`).then(res => res.json())
}

async function getOrganizationEvents(org: string) {
    return fetch(`${API_URL}/api/orgs/${org}/events`).then(res => res.json())
}

export { getOrganisations, getOrganizationEvents }
