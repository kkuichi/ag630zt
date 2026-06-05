import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getAllTests,
  getTestById,
  deleteTest,
  getAssignedTestsForEmployee,
  getAssignedTestsForCompany,
  insertAssignedTest,
  updateAssignedTestDeadline,
  deleteAssignedTest,
  getAssignedTestForTaking,
  evaluateAndSubmitTest,
} from "../models/tests.js";
import { createTest, updateTest } from "../services/tests.js";

const router = Router();

router.get("/assigned", requireAuth, async (req, res) => {
  const { userId, role, companyId } = req.user;
  try {
    if (role === "manažér") {
      if (!companyId) return res.status(400).json({ error: "Váš účet nie je priradený k žiadnej spoločnosti." });
      const assignments = await getAssignedTestsForCompany(companyId);
      return res.json(assignments);
    }
    const assignments = await getAssignedTestsForEmployee(userId);
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/assign", requireAuth, async (req, res) => {
  const { testId, employeeId, deadline } = req.body;
  if (!testId) return res.status(400).json({ error: "testId je povinné." });
  if (!employeeId) return res.status(400).json({ error: "employeeId je povinné." });
  try {
    const assignment = await insertAssignedTest(testId, employeeId, req.user.userId, deadline);
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const tests = await getAllTests();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const { name, description, targetGroup, questions } = req.body;

  if (!name) return res.status(400).json({ error: "Názov testu je povinný." });
  if (!description) return res.status(400).json({ error: "Popis je povinný." });
  if (!targetGroup) return res.status(400).json({ error: "Cieľová skupina je povinná." });
  if (!Array.isArray(questions) || questions.length === 0) return res.status(400).json({ error: "Test musí obsahovať aspoň jednu otázku." });

  try {
    const test = await createTest(name, description, targetGroup, questions);
    res.status(201).json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/assigned/:id", requireAuth, async (req, res) => {
  const { deadline } = req.body;
  try {
    await updateAssignedTestDeadline(req.params.id, deadline);
    res.json({ message: "Deadline bol aktualizovaný." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/assigned/:id/take", requireAuth, async (req, res) => {
  try {
    const test = await getAssignedTestForTaking(req.params.id, req.user.userId);
    if (!test) return res.status(404).json({ error: "Test nebol nájdený alebo nie je priradený vám." });
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/assigned/:id/submit", requireAuth, async (req, res) => {
  const { answers } = req.body;
  if (!answers || typeof answers !== "object") return res.status(400).json({ error: "Odpovede sú povinné." });
  try {
    const result = await evaluateAndSubmitTest(req.params.id, req.user.userId, answers);
    if (!result) return res.status(404).json({ error: "Priradenie nebolo nájdené." });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/assigned/:id", requireAuth, async (req, res) => {
  try {
    await deleteAssignedTest(req.params.id);
    res.json({ message: "Priradenie bolo odstránené." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const test = await getTestById(req.params.id);
    if (!test) return res.status(404).json({ error: "Test nebol nájdený." });
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  const { name, description, targetGroup, questions } = req.body;

  if (!name) return res.status(400).json({ error: "Názov testu je povinný." });
  if (!description) return res.status(400).json({ error: "Popis je povinný." });
  if (!targetGroup) return res.status(400).json({ error: "Cieľová skupina je povinná." });
  if (!Array.isArray(questions) || questions.length === 0) return res.status(400).json({ error: "Test musí obsahovať aspoň jednu otázku." });

  try {
    await updateTest(req.params.id, name, description, targetGroup, questions);
    res.json({ message: "Test bol aktualizovaný." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await deleteTest(req.params.id);
    res.json({ message: "Test bol odstránený." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
