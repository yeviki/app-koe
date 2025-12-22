// controllers/public/tabunganController.js
const ModelData = require("../../models/public/tabunganModel");
const { sanitize } = require("../../utils/validate");

// ===============================
// HELPER INTERNAL
// ===============================
const fieldError = (fields, code = 400) => {
  const err = new Error("Validation Error");
  err.status = code;
  err.fields = fields;
  throw err;
};

const formatDateOnly = (val) => {
  if (!val) return null;

  // kalau sudah YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    return val;
  }

  // ISO date → ambil tanggal saja
  const d = new Date(val);
  return d.toISOString().slice(0, 10);
};
// Tutup Helper

// ambil payload
const getMetaData = (body, file) => ({
  id_nasabah: body.id_nasabah,
  tanggal_simpan: formatDateOnly(body.tanggal_simpan),
  jenis_simpanan: body.jenis_simpanan,
  jumlah_simpanan: sanitize(body.jumlah_simpanan),
  keterangan: sanitize(body.keterangan),
});

// ===============================
// CONTROLLER
// ===============================
exports.getTabungan = async (req, res, next) => {
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
        message: "Anda tidak memiliki akses ke data tabungan",
      });
    }

    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.createTabungan = async (req, res, next) => {
  try {
    const data = getMetaData(req.body, req.file);
    const userId = req.user.id; // pastikan ini ada dari login
    
    // override beberapa field otomatis
    data.id_users = userId;

    await ModelData.create(data);

    res.json({ message: "Data berhasil ditambahkan" });
  } catch (err) {
    next(err);
  }
};

exports.updateTabungan = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ambil data lama
    const [oldRows] = await ModelData.getById(id);
    if (oldRows.length === 0) {
      fieldError({ general: "Data tidak ditemukan" }, 404);
    }
    const data = getMetaData(req.body, req.file);

    await ModelData.update(id, data);

    res.json({ message: "Data berhasil diupdate" });
  } catch (err) {
    next(err);
  }
};

exports.deleteTabungan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await ModelData.getById(id);
    if (rows.length === 0) {
      fieldError({ general: "Data tidak ditemukan" }, 404);
    }

    await ModelData.delete(id);

    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};