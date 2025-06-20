const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hashPassword = (password) => bcrypt.hash(password, 10);
const comparePasswords = (password, hash) => bcrypt.compare(password, hash);
const createToken = (user) =>
  jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

module.exports = { hashPassword, comparePasswords, createToken };
