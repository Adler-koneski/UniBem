import mysql from "mysql2/promise";


const {
DB_HOST,
DB_USER,
DB_PASSWORD,
DB_NAME,
DB_PORT
} = process.env;


export const pool = mysql.createPool({
host: DB_HOST,
user: DB_USER,
password: DB_PASSWORD,
database: DB_NAME,
port: DB_PORT ? Number(DB_PORT) : 3306,
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0
});


export async function ping() {
const conn = await pool.getConnection();
try {
await conn.ping();
return true;
} finally {
conn.release();
}
}