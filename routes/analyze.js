const express = require("express");
const { analyzeIdea } = require("../services/openaiService.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { idea } = req.body;
    const analysis = await analyzeIdea(idea);
    res.json(analysis);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

module.exports = router;
