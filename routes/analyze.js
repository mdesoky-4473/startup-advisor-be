const express = require("express");
const { analyzeIdea } = require("../services/openaiService.js");
const requireAuth = require("../middleware/requireAuth");
const client = require("../db");            

const router = express.Router();

/* POST /api/analyze-idea  (protected) */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { idea } = req.body;
    const analysis = await analyzeIdea(idea);          // { result: "..." }

    // save just the text (or JSON.stringify if you need the whole object)
    await client.query(
      `INSERT INTO ideas (user_id, idea, analysis)
       VALUES ($1, $2, $3)`,
      [req.user.id, idea, analysis.result]
    );

    res.json(analysis);
  } catch (err) {
    console.error("Analysis error:", err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

/* GET /api/analyze-idea/history  (protected) */
router.get("/history", requireAuth, async (req, res) => {
  try {                                             
    const result = await client.query(
      `SELECT id, idea, analysis, created_at
       FROM ideas
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
