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
    const [rows] = await pool.query("SELECT id, username FROM users")
    return rows
}

// Päivittää käyttäjän asetukset uusilla
export async function patchUserSettings(id, path, value) {
    const query = await pool.query(`
    UPDATE users
    SET settings = JSON_REPLACE(settings, ?, ?)
    WHERE id = ?
    `, [path, value, id])

    return query
}

// Päivittää käyttäjän ominaisuuden toisella
export async function patchUserDisplayname(id, value) {
    const query = await pool.query(`
    UPDATE users
    SET displayname = ?
    WHERE id = ?
    `, [value, id])

    return query
}

export async function getUserSettings(id) {
    const [rows] = await pool.query(`
        SELECT settings
        FROM users
        WHERE id = ?
        `, [id])
    return rows[0]
}

// Luo uuden käyttäjän tietokantaan
export async function createUser(username, hash, displayname="") {
    const [result] = await pool.query(`
        INSERT INTO users (username, passhash, displayname)
        VALUES (?, ?, ?)
        `, [username, hash, displayname])
    return result
}

// Hakee tietokannasta käyttäjän ID:n perusteella
export async function getUser(id) {
    const [rows] = await pool.query(`
        SELECT id, username, displayname
        FROM users
        WHERE id = ?
        `, [id])
    return rows[0]
}

export async function getUserByUsername(username) {
    const [result] = await pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
    )
    return result[0]
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
    const [groupRow] = await pool.query(
        `SELECT id, owner_id, group_name as name FROM groups_table WHERE id = ?`, [id])
    
    const [users] = await pool.query(`
        SELECT u.id, u.username, u.displayname FROM users as u
        INNER JOIN group_user as gu ON gu.person_id = u.id WHERE gu.group_id = ?
    `, [id])
    const result = groupRow[0]
    if (!result) throw Exception("404")
    result["users"] = users
    return result;
}

export async function getGroupMemberIds(groupId) {
    const [users] = await pool.query(`
        SELECT u.id FROM users as u
        INNER JOIN group_user as gu ON gu.person_id = u.id WHERE gu.group_id = ?
    `, [groupId])
    return users.map(o => o.id);
}

export async function postGroupEvent(groupId, newEvent) {
    ///TODO: Liian kopioitu käyttäjän tapahtuman luonnista
    if (!(newEvent.title && newEvent.start && newEvent.end)) {
        throw new Error("err:New event requires a title and start&end dates")
    }

    if (isNaN(new Date(newEvent.start))) {
        throw new Error("err:Invalid event start date")
    }

    if (isNaN(new Date(newEvent.end))) {
        throw new Error("err:Invalid event end date")
    }

    await pool.query(`
        INSERT INTO events_table
            (owner_id, is_group_event, title, summary, start, end, color)
        VALUES
            (?, true, ?, ?, ?, ?, ?)
    `, [
        groupId,
        newEvent.title,
        newEvent.summary || "",
        new Date(newEvent.start),
        new Date(newEvent.end),
        newEvent.color || "#a0a0a0",
    ])
}

export async function getGroupsByUserId(userId) {
    const [rows] = await pool.query(`
        SELECT g.id as "Group ID", g.group_name as "Group Name", u.id as "User ID", u.username as "Username"
        FROM groups_table as g INNER JOIN group_user as gu INNER JOIN users as u
        ON g.id = gu.group_id AND gu.person_id = u.id WHERE u.id = ?
    `, [userId])
    const res = rows.map(row => ({
        id: row["Group ID"],
        name: row["Group Name"]
    }))
    return res
}

/**
 * Hakee tietokannasta tapahtumat ryhmän ID:n perusteella.
 * @param {} id 
 */
export async function getEventsByGroupID(id) {
    const [rows] = await pool.query(`
        SELECT * FROM events_table WHERE owner_id = ? AND is_group_event = true
        `,[id]);
    return rows;
}

export async function getExternalBusyByGroupId(groupId) {
    const personal_sql = `
        SELECT
            e.start,
            e.end
        FROM events_table e
        WHERE
            (
                -- kaikki ryhmän jäsenet
                e.owner_id IN (
                    SELECT person_id
                    FROM group_user
                    WHERE group_id = ?
                )
            ) AND e.is_group_event = false
        ORDER BY e.start ASC
    `;

    const group_sql = `
        SELECT
            e.id,
            e.start,
            e.end
        FROM events_table e
        INNER JOIN group_user gu
        ON gu.group_id = e.owner_id
        WHERE (
            gu.person_id IN (
                SELECT person_id
                FROM group_user
                WHERE group_id = ?
            )
        ) AND e.is_group_event = true
        AND e.owner_id != ?
        ORDER BY e.start ASC
    `;

    const [personal_rows] = await pool.query(personal_sql, [groupId]);
    const [group_rows] = await pool.query(group_sql, [groupId, groupId]);


    // Filtteröidään duplikaatit pois
    const seen = {};
    let filtered_groups = group_rows.filter((item) => {
        const key = item.id;
        return seen.hasOwnProperty(key) ? false : (seen[key] = true);
    })
    filtered_groups.forEach(g => delete g.id)

    return personal_rows.concat(filtered_groups);
}

export async function addUserToGroup(groupId, newUserId) {
    await pool.query(`
        INSERT INTO group_user (group_id, person_id) VALUES (?, ?)
    `, [groupId, newUserId])
}

export async function createGroup(groupName, ownerId) {
    const [rows] = await pool.query(`
        INSERT INTO groups_table (owner_id, group_name) VALUES (?, ?)
    `, [ownerId, groupName])
    const newGroupId = rows.insertId
    
    await addUserToGroup(newGroupId, ownerId)
}

export async function deleteGroup(groupId) {
    await pool.query(`
        DELETE FROM groups_table WHERE id=?
    `, [groupId])
    await pool.query(`
        DELETE FROM group_user WHERE group_id =?
    `, [groupId])
}

// Hakee tietokannasta kaikki tapahtumat
export async function getEvents() {
    const [rows] = await pool.query(`
        SELECT * FROM events_table
    `)

    return rows
}

export async function getEventsByUserId(userId) {
    const [rows] = await pool.query(`
        SELECT *
        FROM events_table WHERE owner_id = ? AND is_group_event = false
    `, [userId])
    return rows
}

export async function createUserEvent(userId, newEvent) {
    if (! (newEvent.title && newEvent.start && newEvent.end)) {
        throw new Error("err:New event requires a title and start&end dates")
    }

    if (isNaN(new Date(newEvent.start))) {
        throw new Error("err:Invalid event start date")
    }

    if (isNaN(new Date(newEvent.end))) {
        throw new Error("err:Invalid event end date")
    }

    await pool.query(`
        INSERT INTO events_table
            (owner_id, is_group_event, title, summary, start, end, color)
        VALUES
            (?, false, ?, ?, ?, ?, ?)
    `, [
        userId,
        newEvent.title,
        newEvent.summary || "",
        new Date(newEvent.start),
        new Date(newEvent.end),
        newEvent.color || "#a0a0a0",
    ])
}