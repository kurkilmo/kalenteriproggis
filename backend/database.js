import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

/*
Tutoriaali:
 Node.js ja Express:    https://fullstackopen.com/osa3/node_js_ja_express
 MySQL Node.js Express: https://www.youtube.com/watch?v=Hej48pi_lOc
*/

// Luodaan yhteys tietokantaan
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

// Funktioita tietokannan käsittelyyn
export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users")
    return rows
}

// Luo uuden käyttäjän tietokantaan
export async function createUser(username) {
    const [result] = await pool.query(`
        INSERT INTO users (username)
        VALUES (?)
        `, [username])
    return result
}

// Hakee tietokannasta käyttäjän ID:n perusteella
export async function getUser(id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM users
        WHERE id = ?
        `, [id])
    return rows[0]
}

/**
 * Hakee tietokannasta users, groups ja group_user, jonka jälkeen tekee niistä listan.
 * @returns { [ { "id": 1, "name": "Sammakot", "members": [ {"id": 1, "username": "Heikki"}, {"id": 3, "username": "Matti"} ] },
 *              { "id": 2, "name": "Jänikset", "members": [ {"id": 1, "username": "Heikki"}, {"id": 5, "username": "Jaana"} ] } ] }
 */
export async function getGroups() {
    // Haetaan ryhmät ja niiden jäsenet yhdellä kyselyllä
    const [rows] = await pool.query(`
        SELECT g.id as "Group ID", g.group_name as "Group Name", u.id as "User ID", u.username as "Username"
        FROM groups_table as g INNER JOIN group_user as gu INNER JOIN users as u
        ON g.id = gu.group_id AND gu.person_id = u.id
    `)

    // Järjestellään rivit ryhmittäin
    rows.sort((a, b) => {
        let valA = a["Group ID"]
        let valB = b["Group ID"]
        if (valA < valB) {
            return -1;
        }
        if (valA > valB) {
            return 1;
        }
        return 0;
    })

    let groups = []
    let group = {}
    let members = []
    let lastGroupID = -1

    // Käydään rivit läpi ja muodostetaan ryhmät
    for (const [key, user] of Object.entries(rows)) {
        if (lastGroupID != user["Group ID"]) {
            lastGroupID = user["Group ID"]
            if (group) {
                group["members"] = members
                groups.push(group)
                group = {}
                members = []
            }
            group["id"] = lastGroupID
            group["name"] = user["Group Name"]
        }
        members.push({'id': user["User ID"], 'username': user["Username"]})
    }

    // Lisätään vielä viimeinenkin ryhmä
    group["members"] = members
    groups.push(group)

    return groups.filter((row) => row.id !== undefined)
}

// Hakee tietokannasta ryhmän ID:n perusteella
export async function getGroupById(id) {
    const [rows] = await pool.query(
        `SELECT id, owner_id, group_name as name FROM groups_table WHERE id = ?`, [id])
    return rows;
}

/**
 * Hakee tietokannasta tapahtumat ryhmän ID:n perusteella.
 * @param {} id 
 */
export async function getEventsByGroupID(id) {
    const [rows] = await pool.query(`
        SELECT *
        FROM events_table as e INNER JOIN event_group as eg
        ON e.id = eg.event_id AND eg.group_id = ?
    `, [id])

    return rows
}

// Hakee tietokannasta kaikki tapahtumat
export async function getEvents() {
    const [rows] = await pool.query(`
        SELECT * FROM events_table
    `)

    return rows
}