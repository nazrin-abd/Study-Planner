import mysql from 'mysql2/promise'

const db = mysql.createPool({
  host: nozomi.proxy.rlwy.net,  
  port: 14444,                       
  user: root,                      
  password: AELIZpNjzIVxzxKcOWYZajzvUkNjYZYo,         
  database: railway,               
  ssl: { rejectUnauthorized: false }
})

export default db