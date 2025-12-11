// controllers/moduleController.js
const ModelData = require("../models/moduleModel");
const { sanitize } = require("../utils/validate");

// Helper untuk error per-field
const fieldError = (fields, code = 400) => {
  const err = new Error("Validation Error");
  err.status = code;
  err.fields = fields; // <-- penting!
  throw err;
};

exports.getModule = async (req, res, next) => {
  try {
    const [rows] = await ModelData.getAll();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.createModule = async (req, res, next) => {
  try {
    const module_name   = sanitize(req.body.module_name);
    const label_module  = sanitize(req.body.label_module);
    const id_status       = req.body.id_status;

    // VALIDASI DUPLIKAT
    const [exist] = await ModelData.checkDuplicate(module_name);
    if (exist.length > 0) {
      const errors = {};

      if (exist[0].module_name === module_name) {
        errors.module_name = "Nama module sudah digunakan";
      }
      if (Object.keys(errors).length > 0) {
        return fieldError(errors);
      }
    }

    // SIMPAN
    await ModelData.create({ module_name, label_module, id_status });

    res.json({ message: "Module berhasil ditambahkan" });

  } catch (err) {
    next(err);
  }
};

exports.updateModule = async (req, res, next) => {
  try {
    const { id } = req.params;

    const module_name     = sanitize(req.body.module_name);
    const label_module    = sanitize(req.body.label_module);
    const id_status       = req.body.id_status;

    const [exist] = await ModelData.checkDuplicateOnUpdate(id, module_name);

    if (exist.length > 0) {
      const errors = {};
      if (exist[0].module_name === module_name) {
        errors.module_name = "Module sudah digunakan";
      }
      if (Object.keys(errors).length > 0) {
        return fieldError(errors);
      }
    }

    const data = { module_name, label_module, id_status };

    const [result] = await ModelData.update(id, data);

    if (result.affectedRows === 0) {
      return fieldError({ general: "Module tidak ditemukan" }, 404);
    }

    res.json({ message: "Module berhasil diupdate" });

  } catch (err) {
    next(err);
  }
};

exports.deleteModule = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await ModelData.delete(id);
    if (result.affectedRows === 0) {
      return fieldError({ general: "Module tidak ditemukan" }, 404);
    }

    res.json({ message: "Module berhasil dihapus" });

  } catch (err) {
    next(err);
  }
};



