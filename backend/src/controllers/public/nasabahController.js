// controllers/public/nasabahController.js
const fs = require("fs");
const path = require("path");

const ModelData = require("../../models/public/nasabahModel");
const { buildFileUrl } = require("../../utils/file");
const { sanitize } = require("../../utils/validate");

// lokasi upload
const uploadDir = path.join(__dirname, "../../../uploads/nasabah");
const FILE_FIELDS = [
  "foto_ktp",
  "foto_nasabah",
  "foto_rumah",
  "foto_usaha",
  "foto_promise",
];

// ===============================
// HELPER INTERNAL
// ===============================
const getFileName = (files, field) => {
  if (!files || !files[field]) return undefined;
  return files[field][0].filename;
};

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

// Tutup Helper

// ambil payload
const getNasabahPayload = (body, files) => ({
  no_hp: sanitize(body.no_hp),
  nm_nasabah: sanitize(body.nm_nasabah),
  alamat: body.alamat,
  id_status: body.id_status,
  
  foto_ktp: getFileName(files, "foto_ktp"),
  foto_nasabah: getFileName(files, "foto_nasabah"),
  foto_rumah: getFileName(files, "foto_rumah"),
  foto_usaha: getFileName(files, "foto_usaha"),
  foto_promise: getFileName(files, "foto_promise"),
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
    let currentRoles = req.user.roles_id;

    // normalisasi roles → array
    if (!Array.isArray(currentRoles)) {
      currentRoles = currentRoles ? [currentRoles] : [];
    }

    const primaryRole =
      currentRoles.length > 0 ? parseInt(currentRoles[0]) : null;

    if (!primaryRole) {
      return res
        .status(400)
        .json({ message: "Role tidak ditemukan dalam token" });
    }

    const userId = req.user.id; // id user login

    let rows;

    // =========================
    // ROLE FILTER
    // =========================
    if ([1, 2].includes(primaryRole)) {
      // ADMIN / SUPERUSER → semua data
      [rows] = await ModelData.getAll();
    } else if (primaryRole === 4) {
      // USER → hanya data milik sendiri
      [rows] = await ModelData.getByUser(userId);
    } else {
      // role lain (opsional)
      return res.status(403).json({
        message: "Anda tidak memiliki akses ke data nasabah",
      });
    }

    const data = rows.map(row => ({
      ...row,
      foto_ktp_url: buildFileUrl("nasabah", row.foto_ktp),
      foto_nasabah_url: buildFileUrl("nasabah", row.foto_nasabah),
      foto_rumah_url: buildFileUrl("nasabah", row.foto_rumah),
      foto_usaha_url: buildFileUrl("nasabah", row.foto_usaha),
      foto_promise_url: buildFileUrl("nasabah", row.foto_promise),
    }));

    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.createNasabah = async (req, res, next) => {
  try {
    const data = getNasabahPayload(req.body, req.files);
    const userId = req.user.id; // pastikan ini ada dari login

    
    await validateDuplicateNoHp(data.no_hp);
    
    // override beberapa field otomatis
    data.id_users = userId;
    
    await ModelData.create(data);

    res.json({ message: "Data berhasil ditambahkan" });
  } catch (err) {
    // rollback SEMUA file
    if (req.files) {
      Object.values(req.files).flat().forEach(f =>
        deleteFileIfExists(f.filename)
      );
    }
    next(err);
  }
};

exports.updateNasabah = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [oldRows] = await ModelData.getById(id);
    if (oldRows.length === 0) {
      fieldError({ general: "Data tidak ditemukan" }, 404);
    }

    const oldData = oldRows[0];
    const data = getNasabahPayload(req.body, req.files);

    await validateDuplicateNoHp(data.no_hp, id);

    // kalau field tidak upload → jangan update
    Object.keys(data).forEach(key => {
      if (data[key] === undefined) delete data[key];
    });

    await ModelData.update(id, data);

    // hapus file lama jika diganti
    if (req.files) {
      for (const field in req.files) {
        if (oldData[field]) {
          deleteFileIfExists(oldData[field]);
        }
      }
    }

    res.json({ message: "Data berhasil diupdate" });
  } catch (err) {
    if (req.files) {
      Object.values(req.files).flat().forEach(f =>
        deleteFileIfExists(f.filename)
      );
    }
    next(err);
  }
};

exports.deleteNasabah = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. cek data nasabah
    const [rows] = await ModelData.getById(id);
    if (rows.length === 0) {
      fieldError({ general: "Data tidak ditemukan" }, 404);
    }

    // 2. cek transaksi
    const [trx] = await ModelData.checkTransaksi(id);
    if (trx.length > 0) {
      fieldError(
        { general: "Data nasabah sudah memiliki transaksi dan tidak dapat dihapus" },
        409 // conflict
      );
    }

    const data = rows[0];

    // 3. hapus data DB
    await ModelData.delete(id);

    // 4. hapus semua file fisik
    FILE_FIELDS.forEach(field => {
      deleteFileIfExists(data[field]);
    });

    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};

