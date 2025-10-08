const groups = [
    {
        id: 1,
        name: "kallet",
        eventIds: [1, 2],
        ownerUserId: 1,
        adminIds: [1, 2],
        public: true
    },
    {
        id: 2,
        name: "pekat",
        eventIds: [],
        ownerUserId: 1,
        adminIds: [1, 2],
        public: true
    }
]

function getGroups() {
    return groups
}

export { getGroups }