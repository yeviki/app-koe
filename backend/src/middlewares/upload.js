// middlewares/upload.js
const multer = require("multer");

/**
 * upload middleware (MINIO VERSION)
 *
 * config:
 * - allowedMime   : array mime type
 * - maxSize       : max file size
 * - single        : "fieldName"
 * - fields        : [{ name, maxCount }]
 *
 * NOTE:
 * - storage pakai memoryStorage (WAJIB untuk MinIO)
 * - destination DIABAIKAN
 */
module.exports = ({
  allowedMime = ["image/jpeg", "image/png"],
  maxSize = 2 * 1024 * 1024, // 2MB
  single = null,
  fields = null,
}) => {
  // ===============================
  // STORAGE (MINIO WAJIB)
  // ===============================
  const storage = multer.memoryStorage();

  // ===============================
  // FILE FILTER
  // ===============================
  const fileFilter = (req, file, cb) => {
    if (
      Array.isArray(allowedMime) &&
      allowedMime.length > 0 &&
      !allowedMime.includes(file.mimetype)
    ) {
      return cb(
        new Error(
          `File tidak valid. Hanya diperbolehkan: ${allowedMime.join(", ")}`
        ),
        false
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