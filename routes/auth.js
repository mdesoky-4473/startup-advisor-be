const express = require("express");
const router = express.Router();
const client = require("../db");
const { hashPassword, comparePasswords, createToken } = require("./utils");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashed = await hashPassword(password);
    const result = await client.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
      [username, hashed]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await client.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  const user = result.rows[0];

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await comparePasswords(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = createToken(user);
  res.json({ token });
});

module.exports = router;
