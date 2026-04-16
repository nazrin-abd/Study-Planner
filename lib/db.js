import mysql from 'mysql2/promise'

const db = mysql.createPool({
  host: 'nozomi.proxy.rlwy.net',  // ← public host, NOT mysql.railway.internal
  port: 14444,                       // ← MYSQLPORT from Railway (NOT 3306)
  user: 'root',                      // ← MYSQLUSER
  password: 'AELIZpNjzIVxzxKcOWYZajzvUkNjYZYo',         // ← MYSQLPASSWORD
  database: 'railway',               // ← MYSQLDATABASE
  ssl: { rejectUnauthorized: false }
})

export default db