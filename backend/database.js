import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

/*
Tutoriaali:
 Node.js ja Express:    https://fullstackopen.com/osa3/node_js_ja_express
 MySQL Node.js Express: https://www.youtube.com/watch?v=Hej48pi_lOc
*/

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users")
    return rows
}

export async function createUser(username) {
    const [result] = await pool.query(`
        INSERT INTO users (username)
        VALUES (?)
        `, [username])
    return result
}

export async function getUser(id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM users
        WHERE id = ?
        `, [id])
    return rows[0]
}