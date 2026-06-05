import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import bcrypt from "bcrypt";
import { getAllUsers, getUsersByCompany, getUserMe, updateUserPassword, deleteUser } from "../models/user.js";
import { createUser } from "../services/user.js";
import { updateCompanyManager } from "../models/company.js";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await getUserMe(req.user.userId);
    if (!user) return res.status(404).json({ error: "Používateľ nebol nájdený." });
    const { password, ...safe } = user;
    res.json(safe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/me/password", requireAuth, async (req, res) => {
  const { current, newPassword } = req.body;
  if (!current || !newPassword) return res.status(400).json({ error: "Aktuálne aj nové heslo sú povinné." });
  if (newPassword.length < 6) return res.status(400).json({ error: "Nové heslo musí mať aspoň 6 znakov." });

  try {
    const user = await getUserMe(req.user.userId);
    const match = await bcrypt.compare(current, user.password);
    if (!match) return res.status(401).json({ error: "Aktuálne heslo je nesprávne." });

    const hashed = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(req.user.userId, hashed);
    res.json({ message: "Heslo bolo aktualizované." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/company", requireAuth, async (req, res) => {
  const companyId = req.user.companyId;
  if (!companyId) return res.status(400).json({ error: "Váš účet nie je priradený k žiadnej spoločnosti." });
  try {
    const users = await getUsersByCompany(companyId);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const { fullname, email, role, companyId } = req.body;

  if (!fullname) return res.status(400).json({ error: "Meno a priezvisko je povinné." });
  if (!email) return res.status(400).json({ error: "Email je povinný." });
  if (!role) return res.status(400).json({ error: "Rola je povinná." });
  if (role !== "admin" && !companyId) return res.status(400).json({ error: "Spoločnosť je povinná." });

  try {
    const result = await createUser(fullname, email, companyId || null, role);

    if (role === "manažér" && companyId) {
      await updateCompanyManager(companyId, result.user.id);
    }

    res.status(201).json(result);
  } catch (err) {
    if (err.code === "23505") {
      res.status(409).json({ error: "Používateľ s týmto emailom už existuje." });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.json({ message: "Používateľ bol odstránený." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
