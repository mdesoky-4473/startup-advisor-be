const express = require("express");
const router = express.Router();
const client = require("../db");
const {
  hashPassword,
  comparePasswords,
  createToken,
} = require("./utils");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username & password required" });
    }

    const hashed = await hashPassword(password);

    const result = await client.query(
      `
      INSERT INTO users (username, password_hash)
      VALUES ($1, $2)
      RETURNING id, username
      `,
      [username, hashed]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    // duplicate username?
    if (err.code === "23505") {
      return res.status(409).json({ error: "Username already taken" });
    }
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await client.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await comparePasswords(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = createToken(user);
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
