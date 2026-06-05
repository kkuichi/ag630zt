import { Router } from "express";
import { login } from "../services/auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { pid, password } = req.body;

  if (!pid || !password) {
    return res.status(400).json({ error: "PID a heslo sú povinné." });
  }

  try {
    const { token, role } = await login(pid, password);
    res.json({ token, role });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

export default router;
