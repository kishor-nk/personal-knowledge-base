const { pool } = require("../config/db");

const Category = {
  async create(name, userId) {
    const [result] = await pool.execute(
      "INSERT INTO categories (name, user_id) VALUES (?, ?)",
      [name, userId]
    );

    return {
      id: result.insertId,
      name,
      user_id: userId
    };
  },

  async findByUser(userId) {
    const [rows] = await pool.execute(
      "SELECT * FROM categories WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    return rows;
  },

  async findById(id, userId) {
    const [rows] = await pool.execute(
      "SELECT * FROM categories WHERE id = ? AND user_id = ? LIMIT 1",
      [id, userId]
    );

    return rows[0] || null;
  },

  async delete(id, userId) {
    const [result] = await pool.execute(
      "DELETE FROM categories WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    return result.affectedRows > 0;
  }
};

module.exports = Category;