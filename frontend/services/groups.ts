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

// { "id": 1, "name": "kallet", "members": [1, 5, 7] }
export interface Group {
    "id": number;
    "name": string;
    "members": number[];
}


export async function getGroups() {
    const url = "http://localhost:3001/api/groups"
    let result //: Group[] = [];
  try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        result = await response.json()
        console.log(result)
  } catch (error: any) {
        console.error(error.message);
    }
    console.log("result... :", result)
    return result
}

/*
function getGroups() {
    return groups
}

export { getGroups }

*/