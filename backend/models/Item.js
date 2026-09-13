const path = require("path");
const fs = require("fs");
const { pool } = require("../config/db");

const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    const trimmed = tags.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === "string") {
        return parsed.split(",").map(t => t.trim()).filter(Boolean);
      }
      return [];
    } catch {
      return trimmed.split(",").map(t => t.trim()).filter(Boolean);
    }
  }
  return [];
};

const formatItem = (item) => ({
  _id: item.id,
  id: item.id,
  title: item.title,
  type: item.type,
  content: item.content || "",
  url: item.url || "",
  fileName: item.file_name || "",
  filePath: item.file_path || "",
  tags: parseTags(item.tags),
  category: item.category_name || "General",
  category_id: item.category_id,
  user: item.user_id,
  createdAt: item.created_at,
  updatedAt: item.updated_at
});

const Item = {
  async create(data) {
    const {
      title,
      type,
      content = "",
      url = "",
      fileName = "",
      filePath = "",
      tags = [],
      categoryId = null,
      userId
    } = data;

    const [result] = await pool.execute(
      `INSERT INTO items
      (title, description, type, content, url, tags, file_name, file_path, category_id, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        "",
        type,
        content,
        url,
        JSON.stringify(parseTags(tags)),
        fileName,
        filePath,
        categoryId,
        userId
      ]
    );

    return await Item.findById(result.insertId, userId);
  },

  async findByUser(userId, filters = {}) {
    const { type, category, tag, search } = filters;
    let query = `
      SELECT items.*, categories.name AS category_name
      FROM items
      LEFT JOIN categories ON items.category_id = categories.id
      WHERE items.user_id = ?
    `;
    const params = [userId];

    if (type && type.trim()) {
      query += ` AND LOWER(items.type) = LOWER(?)`;
      params.push(type.trim());
    }

    if (category && category.trim()) {
      query += ` AND LOWER(COALESCE(categories.name, 'General')) LIKE LOWER(?)`;
      params.push(`%${category.trim()}%`);
    }

    if (tag && tag.trim()) {
      query += ` AND LOWER(items.tags) LIKE LOWER(?)`;
      params.push(`%${tag.trim()}%`);
    }

    if (search && search.trim()) {
      const searchParam = `%${search.trim()}%`;
      query += ` AND (
        LOWER(items.title) LIKE LOWER(?) OR
        LOWER(COALESCE(items.content, '')) LIKE LOWER(?) OR
        LOWER(COALESCE(categories.name, 'General')) LIKE LOWER(?) OR
        LOWER(COALESCE(items.tags, '')) LIKE LOWER(?)
      )`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    query += ` ORDER BY items.created_at DESC`;

    const [rows] = await pool.execute(query, params);
    return rows.map(formatItem);
  },

  async findById(id, userId) {
    const [rows] = await pool.execute(
      `SELECT items.*, categories.name AS category_name
       FROM items
       LEFT JOIN categories ON items.category_id = categories.id
       WHERE items.id = ? AND items.user_id = ?
       LIMIT 1`,
      [id, userId]
    );

    return rows[0] ? formatItem(rows[0]) : null;
  },

  async update(id, userId, data) {
    const {
      title,
      type,
      content = "",
      url = "",
      fileName = "",
      filePath = "",
      tags = [],
      categoryId = null
    } = data;

    const [result] = await pool.execute(
      `UPDATE items
       SET title = ?,
           type = ?,
           content = ?,
           url = ?,
           tags = ?,
           file_name = ?,
           file_path = ?,
           category_id = ?
       WHERE id = ? AND user_id = ?`,
      [
        title,
        type,
        content,
        url,
        JSON.stringify(parseTags(tags)),
        fileName,
        filePath,
        categoryId,
        id,
        userId
      ]
    );

    return result.affectedRows > 0;
  },

  async delete(id, userId) {
    const item = await Item.findById(id, userId);

    const [result] = await pool.execute(
      `DELETE FROM items
       WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    if (result.affectedRows > 0 && item && item.filePath) {
      try {
        const fullPath = path.join(__dirname, "../uploads", path.basename(item.filePath));
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (fileErr) {
        console.error("Failed to delete physical file:", fileErr.message);
      }
    }

    return result.affectedRows > 0;
  }
};

Item.parseTags = parseTags;
module.exports = Item;