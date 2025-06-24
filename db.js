const { Client } = require("pg");
require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: false } : false,
});

client.connect();
module.exports = client;
