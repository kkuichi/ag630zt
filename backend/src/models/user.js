import pool from "../db/index.js";

export async function insertUser(fullname, pid, email, hashedPassword, role, companyId) {
  const result = await pool.query(
    "INSERT INTO users (full_name, pid, email, password, role, company_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [fullname, pid, email, hashedPassword, role, companyId],
  );
  return result.rows[0];
}

export async function insertUserWithClient(client, fullname, pid, email, hashedPassword, role, companyId) {
  const result = await client.query(
    "INSERT INTO users (full_name, pid, email, password, role, company_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, pid, full_name, email, role",
    [fullname, pid, email, hashedPassword, role, companyId],
  );
  return result.rows[0];
}

export async function findUserById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

export async function updateUser(id, fields) {
  const result = await pool.query("UPDATE users SET role = $1, company_id = $2 WHERE id = $3 RETURNING *", [fields.role, fields.companyId, id]);
  return result.rows[0];
}

export async function deleteUser(id) {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
}

export async function getAllUsers() {
  const result = await pool.query(
    `SELECT u.id, u.pid, u.full_name, u.email, u.role, u.created_at,
            c.company_name
     FROM users u
     LEFT JOIN companies c ON u.company_id = c.id
     ORDER BY u.created_at DESC`,
  );
  return result.rows;
}

export async function getUsersByCompany(companyId) {
  const result = await pool.query(
    `SELECT id, pid, full_name, email, role, created_at
     FROM users
     WHERE company_id = $1 AND role IN ('zamestnanec', 'študent')
     ORDER BY created_at DESC`,
    [companyId],
  );
  return result.rows;
}

export async function getUserMe(id) {
  const result = await pool.query(
    `SELECT u.id, u.pid, u.full_name, u.email, u.role, u.password, u.created_at,
            c.company_name
     FROM users u
     LEFT JOIN companies c ON c.id = u.company_id
     WHERE u.id = $1`,
    [id],
  );
  return result.rows[0] || null;
}

export async function updateUserPassword(id, hashedPassword) {
  await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, id]);
}
