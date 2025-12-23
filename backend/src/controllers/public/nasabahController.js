const { uploadFiles } = require("../../utils/minioUploader");
const { deleteFiles } = require("../../utils/minioCleaner");
const { getPresignedUrlFromMinio } = require("../../middlewares/minio");

const ModelData = require("../../models/public/nasabahModel");
const { sanitize } = require("../../utils/validate");

const FILE_FIELDS = [
  "foto_ktp",
  "foto_nasabah",
  "foto_rumah",
  "foto_usaha",
  "foto_promise",
];

// ===============================
// HELPER
// ===============================
const fieldError = (fields, code = 400) => {
  const err = new Error("Validation Error");
  err.status = code;
  err.fields = fields;
  throw err;
};

// payload dari body + hasil upload MinIO
const getNasabahPayload = (body, uploadedFiles = {}) => ({
  no_hp: sanitize(body.no_hp),
  nm_nasabah: sanitize(body.nm_nasabah),
  alamat: body.alamat,
  id_status: body.id_status,

  foto_ktp: uploadedFiles.foto_ktp,
  foto_nasabah: uploadedFiles.foto_nasabah,
  foto_rumah: uploadedFiles.foto_rumah,
  foto_usaha: uploadedFiles.foto_usaha,
  foto_promise: uploadedFiles.foto_promise,
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

    const userId = req.user.id;
    let rows;

    if ([1, 2].includes(primaryRole)) {
      [rows] = await ModelData.getAll();
    } else if (primaryRole === 4) {
      [rows] = await ModelData.getByUser(userId);
    } else {
      return res.status(403).json({
        message: "Anda tidak memiliki akses ke data nasabah",
      });
    }

    // presigned URL
    const data = await Promise.all(
      rows.map(async row => ({
        ...row,
        foto_ktp_url: row.foto_ktp
          ? await getPresignedUrlFromMinio(row.foto_ktp, 3600)
          : null,
        foto_nasabah_url: row.foto_nasabah
          ? await getPresignedUrlFromMinio(row.foto_nasabah, 3600)
          : null,
        foto_rumah_url: row.foto_rumah
          ? await getPresignedUrlFromMinio(row.foto_rumah, 3600)
          : null,
        foto_usaha_url: row.foto_usaha
          ? await getPresignedUrlFromMinio(row.foto_usaha, 3600)
          : null,
        foto_promise_url: row.foto_promise
          ? await getPresignedUrlFromMinio(row.foto_promise, 3600)
          : null,
      }))
    );

    res.json(data);
  } catch (err) {
    next(err);
  }
};

// ===============================
// CREATE
// ===============================
exports.createNasabah = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await validateDuplicateNoHp(req.body.no_hp);

    // upload ke MinIO (parallel + rollback)
    const uploadedFiles = await uploadFiles({
      files: req.files,
      folder: "nasabah",
      ownerId: userId,
      totalMaxSize: 5 * 1024 * 1024,
    });

    const data = getNasabahPayload(req.body, uploadedFiles);
    data.id_users = userId;

    await ModelData.create(data);

    res.json({ message: "Data berhasil ditambahkan" });
  } catch (err) {
    next(err);
  }
};

// ===============================
// UPDATE
// ===============================
exports.updateNasabah = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await ModelData.getById(id);
    if (!rows.length) {
      fieldError({ general: "Data tidak ditemukan" }, 404);
    }

    await validateDuplicateNoHp(req.body.no_hp, id);

    const uploadedFiles = await uploadFiles({
      files: req.files,
      folder: "nasabah",
      ownerId: id,
    });

    const data = getNasabahPayload(req.body, uploadedFiles);

    Object.keys(data).forEach(k => data[k] === undefined && delete data[k]);

    await ModelData.update(id, data);

    // hapus file lama yang diganti
    await deleteFiles(
      Object.keys(uploadedFiles).map(field => rows[0][field])
    );

    res.json({ message: "Data berhasil diupdate" });
  } catch (err) {
    next(err);
  }
};

// ===============================
// DELETE
// ===============================
exports.deleteNasabah = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await ModelData.getById(id);
    if (!rows.length) {
      fieldError({ general: "Data tidak ditemukan" }, 404);
    }

    const [trx] = await ModelData.checkTransaksi(id);
    if (trx.length > 0) {
      fieldError(
        { general: "Data nasabah sudah memiliki transaksi" },
        409
      );
    }

    await ModelData.delete(id);

    await deleteFiles(
      FILE_FIELDS.map(field => rows[0][field])
    );

    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};