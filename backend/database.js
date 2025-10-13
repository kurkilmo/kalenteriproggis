import mysql from 'mysql2'

/*
Tutoriaali:
 Node.js ja Express:    https://fullstackopen.com/osa3/node_js_ja_express
 MySQL Node.js Express: https://www.youtube.com/watch?v=Hej48pi_lOc
*/

// TODO älä hardkoodaa tätä
mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'kalenteri_app'
}).promise()