// controllers/nasabahController.js
const ModelData = require("../../models/public/nasabahModel");
const { sanitize } = require("../../utils/validate");

// ===============================
// HELPER INTERNAL (1 FILE)
// ===============================
const fieldError = (fields, code = 400) => {
  const err = new Error("Validation Error");
  err.status = code;
  err.fields = fields;
  throw err;
};

// ambil & sanitize payload (dipakai create & update)
const getNasabahPayload = (body) => ({
  no_hp: sanitize(body.no_hp),
  nm_nasabah: sanitize(body.nm_nasabah),
  alamat: body.alamat,
  id_status: body.id_status,
});

// validasi duplikat no_hp (create & update)
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
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.createNasabah = async (req, res, next) => {
  try {
    const data = getNasabahPayload(req.body);

    await validateDuplicateNoHp(data.no_hp);

    await ModelData.create(data);

    res.json({ message: "Data berhasil ditambahkan" });
  } catch (err) {
    next(err);
  }
};

exports.updateNasabah = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = getNasabahPayload(req.body);

    await validateDuplicateNoHp(data.no_hp, id);

    const [result] = await ModelData.update(id, data);

    if (result.affectedRows === 0) {
      fieldError({ general: "Data tidak ditemukan" }, 404);
    }

    res.json({ message: "Data berhasil diupdate" });
  } catch (err) {
    next(err);
  }
};

exports.deleteNasabah = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await ModelData.delete(id);
    if (result.affectedRows === 0) {
      fieldError({ general: "Data tidak ditemukan" }, 404);
    }

    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    next(err);
  }
};
