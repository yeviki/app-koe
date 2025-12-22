// middlewares/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * upload middleware (GLOBAL)
 *
 * config:
 * - destination   : folder upload
 * - allowedMime   : array mime type
 * - maxSize       : max file size
 * - single        : "fieldName"
 * - fields        : [{ name, maxCount }]
 */
module.exports = ({
  destination = "uploads",
  allowedMime = ["image/jpeg", "image/png"],
  maxSize = 2 * 1024 * 1024, // 2MB
  single = null,
  fields = null,
}) => {
  // pastikan folder ada
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const unique =
        Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, unique + ext);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (!allowedMime.includes(file.mimetype)) {
      return cb(
        new Error(
          `File tidak valid. Hanya diperbolehkan: ${allowedMime.join(
            ", "
          )}`
        )
      );
    }
    cb(null, true);
  };

  const upload = multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter,
  });

  // ===============================
  // MODE UPLOAD
  // ===============================
  if (single) {
    return upload.single(single);
  }

  if (Array.isArray(fields)) {
    return upload.fields(fields);
  }

  throw new Error(
    "Upload middleware error: gunakan `single` atau `fields`"
  );
};
