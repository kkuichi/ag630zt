import pool from "../db/index.js";

export async function getAllResources() {
  const result = await pool.query("SELECT * FROM resources ORDER BY type, created_at DESC");
  return result.rows;
}

export async function getResourceById(id) {
  const result = await pool.query("SELECT * FROM resources WHERE id = $1", [id]);
  return result.rows[0] || null;
}

export async function insertResource(title, description, url, type) {
  const result = await pool.query("INSERT INTO resources (title, description, url, type) VALUES ($1, $2, $3, $4) RETURNING *", [
    title,
    description || null,
    url,
    type,
  ]);
  return result.rows[0];
}

export async function updateResource(id, title, description, url, type) {
  const result = await pool.query("UPDATE resources SET title = $1, description = $2, url = $3, type = $4 WHERE id = $5 RETURNING *", [
    title,
    description || null,
    url,
    type,
    id,
  ]);
  return result.rows[0] || null;
}

export async function deleteResource(id) {
  await pool.query("DELETE FROM resources WHERE id = $1", [id]);
}
