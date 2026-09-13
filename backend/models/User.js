const { pool } = require("../config/db");

const User = {
  async create(name, email, password) {
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    return {
      id: result.insertId,
      name,
      email,
      password
    };
  },

  async findByEmail(email) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE id = ? LIMIT 1",
      [id]
    );

    return rows[0] || null;
  }
};

module.exports = User;