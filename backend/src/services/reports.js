import pool from "../db/index.js";
import { insertReport, insertReportImage } from "../models/reports.js";
import { uploadToCloudinary } from "../middleware/upload.js";

export async function createReport(companyId, reportedBy, fields, files) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const report = await insertReport(
      client,
      companyId,
      reportedBy,
      fields.title,
      fields.description,
      fields.location,
      fields.severity,
      fields.occurred_at,
    );

    if (files && files.length > 0) {
      for (const file of files) {
        const url = await uploadToCloudinary(file.buffer);
        await insertReportImage(client, report.id, url);
      }
    }

    await client.query("COMMIT");
    return report;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
