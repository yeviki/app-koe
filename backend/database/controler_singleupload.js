// controllers/public/nasabahController.js
const fs = require("fs");
const path = require("path");

const ModelData = require("../../models/public/nasabahModel");
const { buildFileUrl } = require("../../utils/file");
const { sanitize } = require("../../utils/validate");

// lokasi upload
const uploadDir = path.join(__dirname, "../../../uploads/nasabah");

// ===============================
// HELPER INTERNAL
// ===============================
const fieldError = (fields, code = 400) => {
  const err = new Error("Validation Error");
  err.status = code;
  err.fields = fields;
  throw err;
};

// hapus file helper (AMAN)
const deleteFileIfExists = (filename) => {
  if (!filename) return;

  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// ambil payload
const getNasabahPayload = (body, file) => ({
  no_hp: sanitize(body.no_hp),
  nm_nasabah: sanitize(body.nm_nasabah),
  alamat: body.alamat,
  id_status: body.id_status,
  foto_ktp: file ? file.filename : undefined,
});

// validasi duplikat
const validateDuplicateNoHp = async (no_hp, id = null) => {
  let exist;

  if (id) {
    [exist] = await ModelData.checkDuplicateOnUpdate(id, no_hp);
  } else {
    [exist] = await ModelData.checkDuplicate(no_hp);
  }

  if (exist.length > 0) {
    fieldError({ no_hp: "No HP sudah digunakan" });
  }
};

// ===============================
// CONTROLLER
// ===============================
exports.getNasabah = async (req, res, next) => {
  try {
    const [rows] = await ModelData.getAll();

    const data = rows.map(row => ({
      ...row,
      foto_ktp_url: buildFileUrl("nasabah", row.foto_ktp)
    }));

    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.createNasabah = async (req, res, next) => {
  try {
    const data = getNasabahPayload(req.body, req.file);

    await validateDuplicateNoHp(data.no_hp);

    await ModelData.create(data);

    res.json({ message: "Data berhasil ditambahkan" });
  } catch (err) {
    // rollback file jika error
    if (req.file) deleteFileIfExists(req.file.filename);
    next(err);
  }
};

exports.updateNasabah = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ambil data lama
    const [oldRows] = await ModelData.getById(id);
    if (oldRows.length === 0) {
      fieldError({ general: "Data tidak ditemukan" }, 404);
    }

    const oldData = oldRows[0];
    const data = getNasabahPayload(req.body, req.file);

    await validateDuplicateNoHp(data.no_hp, id);

    // jika tidak upload file baru → jangan update kolom file
    if (!req.file) {
      delete data.foto_ktp;
    }

    await ModelData.update(id, data);

    // jika upload file baru → hapus file lama
    if (req.file && oldData.foto_ktp) {
      deleteFileIfExists(oldData.foto_ktp);
    }

    res.json({ message: "Data berhasil diupdate" });
  } catch (err) {
    // rollback file baru jika gagal
    if (req.file) deleteFileIfExists(req.file.filename);
    next(err);
  }
};

exports.deleteNasabah = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await ModelData.getById(id);
    if (rows.length === 0) {
      fieldError({ general: "Data tidak ditemukan" }, 404);
    }

    const data = rows[0];

    await ModelData.delete(id);

    // hapus file fisik
    deleteFileIfExists(data.foto_ktp);

    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};





// middlewares/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

module.exports = ({
  fieldName = "file",
  destination = "uploads",
  allowedMime = ["image/jpeg", "image/png"],
  maxSize = 2 * 1024 * 1024, // 2MB
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
      const name = `${fieldName}-${Date.now()}${ext}`;
      cb(null, name);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (!allowedMime.includes(file.mimetype)) {
      return cb(
        new Error(`File tidak valid (${allowedMime.join(", ")})`)
      );
    }
    cb(null, true);
  };

  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter,
  }).single(fieldName);
};
