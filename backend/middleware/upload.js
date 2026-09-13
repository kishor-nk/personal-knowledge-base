const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Explicit allowlist of safe document and image formats
const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
  ".rtf",
  ".csv",
  ".md",
  ".odt",
  ".ods",
  ".odp",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif"
]);

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    const error = new Error(
      `File type '${ext || "unknown"}' is not allowed. Allowed formats: PDF, Word (DOC, DOCX), Excel (XLS, XLSX), PowerPoint (PPT, PPTX), OpenDocument (ODT, ODS, ODP), Text (TXT, RTF, CSV, MD), and Images (JPG, PNG, WEBP, GIF).`
    );
    error.code = "INVALID_FILE_TYPE";
    return cb(error, false);
  }

  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    cb(
      null,
      `${Date.now()}-${safeName}`
    );
  }
});

const multerInstance = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  },
  fileFilter
});

const upload = {
  single: (fieldName) => (req, res, next) => {
    multerInstance.single(fieldName)(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File size exceeds the 10 MB limit. Please upload a smaller file."
          });
        }
        return res.status(400).json({
          message: err.message || "File upload rejected."
        });
      }
      next();
    });
  }
};

module.exports = upload;