import pool from "../db/index.js";

export async function getAllCompanies() {
  const result = await pool.query(
    `SELECT c.id, c.company_name, c.ico, c.address, c.created_at,
            m.full_name AS manager_name
     FROM companies c
     LEFT JOIN users m ON m.id = c.manager_id
     ORDER BY c.created_at DESC`,
  );
  return result.rows;
}

export async function insertCompanyOnly(name, address, ico) {
  const result = await pool.query("INSERT INTO companies (company_name, address, ico) VALUES ($1, $2, $3) RETURNING *", [name, address || null, ico]);
  return result.rows[0];
}

export async function insertCompany(client, name, address, ico) {
  const result = await client.query("INSERT INTO companies (company_name, address, ico) VALUES ($1, $2, $3) RETURNING *", [
    name,
    address || null,
    ico,
  ]);
  return result.rows[0];
}

export async function updateCompanyManager(companyId, managerId) {
  await pool.query("UPDATE companies SET manager_id = $1 WHERE id = $2", [managerId, companyId]);
}

export async function updateCompanyManagerWithClient(client, companyId, managerId) {
  await client.query("UPDATE companies SET manager_id = $1 WHERE id = $2", [managerId, companyId]);
}

export async function deleteCompany(id) {
  await pool.query("DELETE FROM companies WHERE id = $1", [id]);
}

export async function getCompanyByUserId(userId) {
  const result = await pool.query(
    `SELECT c.id, c.company_name, c.ico, c.address, c.created_at,
            m.full_name AS manager_name,
            COUNT(u.id) AS employee_count
     FROM companies c
     JOIN users cu ON cu.id = $1 AND cu.company_id = c.id
     LEFT JOIN users m ON m.id = c.manager_id
     LEFT JOIN users u ON u.company_id = c.id
     GROUP BY c.id, m.full_name`,
    [userId],
  );
  return result.rows[0] || null;
}
