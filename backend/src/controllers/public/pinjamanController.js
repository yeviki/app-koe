// controllers/public/pinjamanController.js
const ModelData = require("../../models/public/pinjamanModel");
const { sanitize } = require("../../utils/validate");
const db = require("../../config/db"); // ✅ TAMBAHKAN INI

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

// ===============================
// HELPER NOMOR REGIS
// ===============================
const generateNomorRegis = async () => {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2); // 2 digit tahun
  const mm = String(now.getMonth() + 1).padStart(2, "0"); // 2 digit bulan
  const dd = String(now.getDate()).padStart(2, "0"); // 2 digit tanggal

  // Ambil nomor urut terakhir untuk tahun ini
  const sql = `
    SELECT nomor_regis 
    FROM dt_pinjaman 
    WHERE nomor_regis LIKE ?
    ORDER BY id DESC LIMIT 1
  `;
  const likePattern = `____${dd}${mm}${yy}%`; // 4 digit urut + ddmmyy
  const [rows] = await db.query(sql, [likePattern]);

  let nextNo = 1;
  if (rows.length > 0) {
    const lastNo = rows[0].nomor_regis;
    // ambil 4 digit pertama
    nextNo = parseInt(lastNo.slice(0, 4), 10) + 1;
  }

  const nomorUrut = String(nextNo).padStart(4, "0");
  return `${nomorUrut}${dd}${mm}${yy}`;
};
// Tutup Helper

// ambil payload
const getMetaData = (body) => ({
  id_nasabah            : body.id_nasabah,
  tgl_pinjaman          : formatDateOnly(body.tgl_pinjaman),
  jml_pinjaman          : sanitize(body.jml_pinjaman),
  adm                   : sanitize(body.adm),
  bunga                 : sanitize(body.bunga),
  tot_bunga             : sanitize(body.tot_bunga),
  tenor_hari            : sanitize(body.tenor_hari),
  total_angsuran        : sanitize(body.total_angsuran),
  total_diterima        : sanitize(body.total_diterima),
  status_transaksi      : body.status_transaksi,
  total_keseluruhan     : body.total_keseluruhan,
  keterangan            : body.keterangan,
});

// ===============================
// CONTROLLER
// ===============================
exports.getPinjaman = async (req, res, next) => {
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

    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.createPinjaman = async (req, res, next) => {
  try {
    const userId = req.user.id; // pastikan ini ada dari login
    const createdDate = new Date();

    const nomor_regis = await generateNomorRegis();

    const data = getMetaData(req.body);

    // override beberapa field otomatis
    data.id_users = userId;
    data.created_date = createdDate;
    data.nomor_regis = nomor_regis;

    await ModelData.create(data);

    res.json({ message: "Data berhasil ditambahkan" });
  } catch (err) {
    next(err);
  }
};

exports.updatePinjaman = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ambil data lama
    const [oldRows] = await ModelData.getById(id);
    if (oldRows.length === 0) {
      fieldError({ general: "Data tidak ditemukan" }, 404);
    }
    const data = getMetaData(req.body);

    await ModelData.update(id, data);

    res.json({ message: "Data berhasil diupdate" });
  } catch (err) {
    next(err);
  }
};

exports.deletePinjaman = async (req, res, next) => {
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