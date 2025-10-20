/** Lähtökohtainen formaatti */
const users = [
    {
        id: 1,
        username: "kimmo2",
        events: [1, 2],
        groups: [2]
    }
]

export interface User {
    id: number;
    username: string;
}

export async function getUsers() {
    const url = "http://localhost:3001/api/users"
    let result: User[] = [];
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
    return result
}

export async function getUser(id: number) {
    const url = `http://localhost:3001/api/users/${id}`
    let result: User = {id: -1, username: "unknown"};
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
    return result
}