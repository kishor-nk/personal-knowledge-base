const path = require("path");
const fs = require("fs");
const express = require("express");
const Item = require("../models/Item");
const Category = require("../models/Category");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const { search, type, category, tag } = req.query;
    const items = await Item.findByUser(req.user.id, { search, type, category, tag });
    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id, req.user.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    const {
      title,
      type,
      content,
      url,
      category,
      tags
    } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        message: "Title and type are required"
      });
    }

    let categoryId = null;

    if (category && category.trim()) {
      const categories = await Category.findByUser(req.user.id);

      let foundCategory = categories.find(
        c =>
          c.name.toLowerCase() ===
          category.trim().toLowerCase()
      );

      if (!foundCategory) {
        foundCategory = await Category.create(
          category.trim(),
          req.user.id
        );
      }

      categoryId = foundCategory.id;
    }

    const item = await Item.create({
      title,
      type,
      content: content || "",
      url: url || "",
      categoryId,
      tags: tags ? Item.parseTags(tags) : [],
      fileName: req.file?.originalname || "",
      filePath: req.file
        ? `/uploads/${req.file.filename}`
        : "",
      userId: req.user.id
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.put("/:id", auth, upload.single("file"), async (req, res) => {
  try {
    const existingItem = await Item.findById(
      req.params.id,
      req.user.id
    );

    if (!existingItem) {
      if (req.file) {
        try {
          const tempPath = path.join(__dirname, "../uploads", req.file.filename);
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        } catch (err) {}
      }
      return res.status(404).json({
        message: "Item not found"
      });
    }

    const {
      title,
      type,
      content,
      url,
      category,
      tags
    } = req.body;

    let categoryId = existingItem.category_id || null;

    if (category && category.trim()) {
      const categories = await Category.findByUser(
        req.user.id
      );

      let foundCategory = categories.find(
        c =>
          c.name.toLowerCase() ===
          category.trim().toLowerCase()
      );

      if (!foundCategory) {
        foundCategory = await Category.create(
          category.trim(),
          req.user.id
        );
      }

      categoryId = foundCategory.id;
    }

    let newFileName = existingItem.fileName || "";
    let newFilePath = existingItem.filePath || "";
    let oldFilePathToDelete = null;

    if (req.file) {
      newFileName = req.file.originalname;
      newFilePath = `/uploads/${req.file.filename}`;
      if (existingItem.filePath) {
        oldFilePathToDelete = existingItem.filePath;
      }
    }

    const updated = await Item.update(
      req.params.id,
      req.user.id,
      {
        title: title ?? existingItem.title,
        type: type ?? existingItem.type,
        content: content ?? existingItem.content,
        url: url ?? existingItem.url,
        categoryId,
        tags: tags !== undefined ? Item.parseTags(tags) : existingItem.tags,
        fileName: newFileName,
        filePath: newFilePath
      }
    );

    if (!updated) {
      if (req.file) {
        try {
          const tempPath = path.join(__dirname, "../uploads", req.file.filename);
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        } catch (err) {}
      }
      return res.status(404).json({
        message: "Item not found"
      });
    }

    // Safely delete old physical file only after successful database update
    if (oldFilePathToDelete) {
      try {
        const oldDiskPath = path.join(__dirname, "../uploads", path.basename(oldFilePathToDelete));
        if (fs.existsSync(oldDiskPath)) {
          fs.unlinkSync(oldDiskPath);
        }
      } catch (fileErr) {
        console.error("Failed to delete replaced file:", fileErr.message);
      }
    }

    const item = await Item.findById(
      req.params.id,
      req.user.id
    );

    res.json(item);
  } catch (error) {
    if (req.file) {
      try {
        const tempPath = path.join(__dirname, "../uploads", req.file.filename);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      } catch (err) {}
    }
    res.status(500).json({
      message: error.message
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Item.delete(
      req.params.id,
      req.user.id
    );

    if (!deleted) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    res.json({
      message: "Item deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;