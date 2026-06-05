import pool from "../db/index.js";

export async function findUserByPID(pid) {
  const result = await pool.query("SELECT * FROM users WHERE pid = $1", [pid]);
  return result.rows[0];
}
