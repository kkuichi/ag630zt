import pool from "../db/index.js";

export async function insertReport(client, companyId, reportedBy, title, description, location, severity, occurredAt) {
  const result = await client.query(
    `INSERT INTO reports (company_id, reported_by, title, description, location, severity, status, occurred_at)
     VALUES ($1, $2, $3, $4, $5, $6, 'Vytvorený', $7) RETURNING *`,
    [companyId, reportedBy, title, description || null, location || null, severity, occurredAt],
  );
  return result.rows[0];
}

export async function insertReportImage(client, reportId, imageUrl) {
  await client.query("INSERT INTO report_images (report_id, image_url) VALUES ($1, $2)", [reportId, imageUrl]);
}

export async function getAllReportsByCompany(companyId) {
  const result = await pool.query(
    `SELECT r.id, r.title, r.location, r.severity, r.status, r.occurred_at,
            reporter.full_name AS reported_by_name,
            assignee.full_name AS assigned_to_name
     FROM reports r
     JOIN users reporter ON reporter.id = r.reported_by
     LEFT JOIN users assignee ON assignee.id = r.assigned_to
     WHERE r.company_id = $1
     ORDER BY r.created_at DESC`,
    [companyId],
  );
  return result.rows;
}

export async function getReportById(id) {
  const report = await pool.query(
    `SELECT r.*,
            reporter.full_name AS reported_by_name,
            assignee.full_name AS assigned_to_name
     FROM reports r
     JOIN users reporter ON reporter.id = r.reported_by
     LEFT JOIN users assignee ON assignee.id = r.assigned_to
     WHERE r.id = $1`,
    [id],
  );
  if (!report.rows[0]) return null;

  const images = await pool.query("SELECT image_url FROM report_images WHERE report_id = $1 ORDER BY id ASC", [id]);
  return { ...report.rows[0], images: images.rows.map((r) => r.image_url) };
}

export async function updateReportAssignee(id, assignedTo) {
  await pool.query("UPDATE reports SET assigned_to = $1, status = 'Priradený', updated_at = NOW() WHERE id = $2", [assignedTo, id]);
}

export async function setReportDone(id, resolutionNote) {
  await pool.query("UPDATE reports SET status = 'Vyriešený', resolution_note = $1, updated_at = NOW() WHERE id = $2", [resolutionNote || null, id]);
}

export async function getReportsAssignedToUser(userId) {
  const result = await pool.query(
    `SELECT r.id, r.title, r.location, r.severity, r.status, r.occurred_at,
            reporter.full_name AS reported_by_name
     FROM reports r
     JOIN users reporter ON reporter.id = r.reported_by
     WHERE r.assigned_to = $1
     ORDER BY r.created_at DESC`,
    [userId],
  );
  return result.rows;
}

export async function deleteReport(id) {
  await pool.query("DELETE FROM reports WHERE id = $1", [id]);
}
