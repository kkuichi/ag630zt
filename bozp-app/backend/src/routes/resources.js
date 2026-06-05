import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getAllResources, getResourceById, insertResource, updateResource, deleteResource } from "../models/resources.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const resources = await getAllResources();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const { title, description, url, type } = req.body;
  if (!title) return res.status(400).json({ error: "Názov je povinný." });
  if (!url) return res.status(400).json({ error: "URL je povinná." });
  if (!type) return res.status(400).json({ error: "Typ je povinný." });
  try {
    const resource = await insertResource(title, description, url, type);
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const resource = await getResourceById(req.params.id);
    if (!resource) return res.status(404).json({ error: "Materiál nebol nájdený." });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  const { title, description, url, type } = req.body;
  if (!title) return res.status(400).json({ error: "Názov je povinný." });
  if (!url) return res.status(400).json({ error: "URL je povinná." });
  if (!type) return res.status(400).json({ error: "Typ je povinný." });
  try {
    const resource = await updateResource(req.params.id, title, description, url, type);
    if (!resource) return res.status(404).json({ error: "Materiál nebol nájdený." });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await deleteResource(req.params.id);
    res.json({ message: "Materiál bol odstránený." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
