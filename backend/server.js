require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { pool, connectDB } = require("./config/db");
const auth = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Personal Knowledge Base API is running" });
});

// Authenticated document serving - verifies ownership before sending
app.get("/uploads/:filename", auth, async (req, res) => {
  try {
    const rawFilename = req.params.filename;
    const filename = path.basename(rawFilename);
    const expectedPath = `/uploads/${filename}`;

    // Verify ownership in MariaDB database
    const [rows] = await pool.execute(
      "SELECT id, file_name, file_path, user_id FROM items WHERE (file_path = ? OR file_path LIKE ?) AND user_id = ? LIMIT 1",
      [expectedPath, `%${filename}`, req.user.id]
    );

    if (!rows || rows.length === 0) {
      // Check if file belongs to another user
      const [otherRows] = await pool.execute(
        "SELECT id FROM items WHERE (file_path = ? OR file_path LIKE ?) LIMIT 1",
        [expectedPath, `%${filename}`]
      );

      if (otherRows && otherRows.length > 0) {
        return res.status(403).json({
          message: "Access denied. You do not have permission to access this file."
        });
      }

      return res.status(404).json({ message: "File not found." });
    }

    const uploadDir = path.resolve(__dirname, "uploads");
    const diskPath = path.resolve(uploadDir, filename);

    // Prevent path traversal
    if (!diskPath.startsWith(uploadDir)) {
      return res.status(400).json({ message: "Invalid file request." });
    }

    if (!fs.existsSync(diskPath)) {
      return res.status(404).json({ message: "File not found on server." });
    }

    // Set secure headers
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.sendFile(diskPath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/categories", categoryRoutes);

// Global error handler
app.use((err, req, res, next) => {
  if (err) {
    return res.status(err.status || 400).json({
      message: err.message || "An unexpected error occurred."
    });
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));