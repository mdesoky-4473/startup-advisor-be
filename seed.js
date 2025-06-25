require("dotenv").config();
const bcrypt = require("bcrypt");
const client = require("./db");

(async () => {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
    );

      await client.query(`
      CREATE TABLE ideas (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        idea TEXT NOT NULL,
        analysis TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
    );

    // --- optional demo account ---
    const hash = await bcrypt.hash("demo123", 10);
    await client.query(
      `INSERT INTO users (username, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (username) DO NOTHING;`,
      ["demo", hash]
    );

    console.log("✅ DB seeded.");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await client.end();
  }
})();
