// controllers/controlController.js
const ModelData = require("../models/controlModel");
const { sanitize } = require("../utils/validate");

// Helper untuk error per-field
const fieldError = (fields, code = 400) => {
  const err = new Error("Validation Error");
  err.status = code;
  err.fields = fields; // <-- penting!
  throw err;
};

exports.getControl = async (req, res, next) => {
  try {
    const [rows] = await ModelData.getAll();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.createControl = async (req, res, next) => {
  try {
    const control_name    = sanitize(req.body.control_name);
    const label_control   = sanitize(req.body.label_control);
    const id_status       = req.body.id_status;

    // VALIDASI DUPLIKAT
    const [exist] = await ModelData.checkDuplicate(control_name);
    if (exist.length > 0) {
      const errors = {};

      if (exist[0].control_name === control_name) {
        errors.control_name = "Nama control sudah digunakan";
      }
      if (Object.keys(errors).length > 0) {
        return fieldError(errors);
      }
    }

    // SIMPAN
    await ModelData.create({ control_name, label_control, id_status });

    res.json({ message: "Control berhasil ditambahkan" });

  } catch (err) {
    next(err);
  }
};

exports.updateControl = async (req, res, next) => {
  try {
    const { id } = req.params;

    const control_name  = sanitize(req.body.control_name);
    const label_control = sanitize(req.body.label_control);
    const id_status     = req.body.id_status;

    const [exist] = await ModelData.checkDuplicateOnUpdate(id, control_name);

    if (exist.length > 0) {
      const errors = {};
      if (exist[0].control_name === control_name) {
        errors.control_name = "Control sudah digunakan";
      }
      if (Object.keys(errors).length > 0) {
        return fieldError(errors);
      }
    }

    const data = { control_name, label_control, id_status };

    const [result] = await ModelData.update(id, data);

    if (result.affectedRows === 0) {
      return fieldError({ general: "Control tidak ditemukan" }, 404);
    }

    res.json({ message: "Control berhasil diupdate" });

  } catch (err) {
    next(err);
  }
};

exports.deleteControl = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await ModelData.delete(id);
    if (result.affectedRows === 0) {
      return fieldError({ general: "Control tidak ditemukan" }, 404);
    }

    res.json({ message: "Control berhasil dihapus" });

  } catch (err) {
    next(err);
  }
};



