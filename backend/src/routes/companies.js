import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getAllCompanies, deleteCompany, getCompanyByUserId } from "../models/company.js";
import { createCompanyWithManager, createCompanyOnly } from "../services/company.js";

const router = Router();

router.get("/my", requireAuth, async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.userId);
    if (!company) return res.status(404).json({ error: "Spoločnosť pre tohto používateľa nebola nájdená." });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const companies = await getAllCompanies();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const { company, manager } = req.body;

  if (!company?.name) return res.status(400).json({ error: "Názov spoločnosti je povinný." });
  if (!company?.ico) return res.status(400).json({ error: "IČO je povinné." });

  try {
    if (manager) {
      if (!manager.fullname) return res.status(400).json({ error: "Meno manažéra je povinné." });
      if (!manager.email) return res.status(400).json({ error: "Email manažéra je povinný." });

      const result = await createCompanyWithManager(company, manager);
      res.status(201).json(result);
    } else {
      const result = await createCompanyOnly(company);
      res.status(201).json({ company: result });
    }
  } catch (err) {
    if (err.code === "23505") {
      res.status(409).json({ error: "Spoločnosť s týmto IČO alebo email manažéra už existuje." });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await deleteCompany(req.params.id);
    res.json({ message: "Spoločnosť bola odstránená." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
