import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  getAllReportsByCompany,
  getReportById,
  updateReportAssignee,
  setReportDone,
  deleteReport,
  getReportsAssignedToUser,
} from "../models/reports.js";
import { createReport } from "../services/reports.js";

const router = Router();

router.get("/my", requireAuth, async (req, res) => {
  try {
    const reports = await getReportsAssignedToUser(req.user.userId);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", requireAuth, async (req, res) => {
  const companyId = req.user.companyId;
  if (!companyId) return res.status(400).json({ error: "Váš účet nie je priradený k žiadnej spoločnosti." });
  try {
    const reports = await getAllReportsByCompany(companyId);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", requireAuth, upload.array("images", 10), async (req, res) => {
  const { title, description, location, severity, occurred_at } = req.body;
  const companyId = req.user.companyId;
  const reportedBy = req.user.userId;

  if (!title) return res.status(400).json({ error: "Názov je povinný." });
  if (!occurred_at) return res.status(400).json({ error: "Dátum udalosti je povinný." });
  if (!companyId) return res.status(400).json({ error: "Váš účet nie je priradený k žiadnej spoločnosti." });

  try {
    const report = await createReport(companyId, reportedBy, { title, description, location, severity, occurred_at }, req.files);
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const report = await getReportById(req.params.id);
    if (!report) return res.status(404).json({ error: "Incident nebol nájdený." });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/assign", requireAuth, async (req, res) => {
  const { assignedTo } = req.body;
  if (!assignedTo) return res.status(400).json({ error: "Pole assignedTo je povinné." });
  try {
    await updateReportAssignee(req.params.id, assignedTo);
    res.json({ message: "Priradenie bolo aktualizované." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/done", requireAuth, async (req, res) => {
  const { resolutionNote } = req.body;
  if (!resolutionNote?.trim()) return res.status(400).json({ error: "Poznámka k riešeniu je povinná." });
  try {
    await setReportDone(req.params.id, resolutionNote);
    res.json({ message: "Incident bol označený ako vyriešený." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await deleteReport(req.params.id);
    res.json({ message: "Incident bol odstránený." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
