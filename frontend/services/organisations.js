const organisations = [
    {
        id: 1,
        name: "Lippu.fi",
        eventIds: [1, 2],
        ownerUserId: 1,
        adminIds: [1, 2],
        public: true
    },
    {
        id: 2,
        name: "Algo",
        eventIds: [],
        ownerUserId: 1,
        adminIds: [1, 2],
        public: true
    }
]

function getOrganisations() {
    return organisations
}

export { getOrganisations }