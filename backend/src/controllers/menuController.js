// controllers/menuController.js
const Menu = require("../models/menuModel");
const { sanitize } = require("../utils/validate");

// Helper untuk error per-field
const fieldError = (fields, code = 400) => {
  const err = new Error("Validation Error");
  err.status = code;
  err.fields = fields; // <-- penting!
  throw err;
};

exports.getMenu = async (req, res, next) => {
  try {
    const [rows] = await Menu.getAll();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.createMenu = async (req, res, next) => {
  try {
    const title_menu  = sanitize(req.body.title_menu);
    const url_menu    = sanitize(req.body.url_menu);
    const order_menu  = req.body.order_menu;
    const icon_menu   = req.body.icon_menu;
    const parent_id   = req.body.parent_id || null;
    const component   = req.body.component;

    // SKIP VALIDATION jika "-" atau "#"
    const skipValidation = (url_menu === "-" || url_menu === "#");

    if (!skipValidation) {
      // VALIDASI DUPLIKAT
      const [exist] = await Menu.checkDuplicate(title_menu, url_menu);
      if (exist.length > 0) {
        const errors = {};

        if (exist[0].title_menu === title_menu) {
          errors.title_menu = "Title menu sudah digunakan";
        }
        if (exist[0].url_menu === url_menu) {
          errors.url_menu = "Url menu sudah digunakan";
        }
        if (Object.keys(errors).length > 0) {
          return fieldError(errors);
        }
      }
    }

    await Menu.create({ title_menu, url_menu, icon_menu, order_menu, parent_id, component });

    res.json({ message: "Menu berhasil ditambahkan" });

  } catch (err) {
    next(err);
  }
};

exports.updateMenu = async (req, res, next) => {
  try {
    const { id } = req.params;

    const title_menu  = sanitize(req.body.title_menu);
    const url_menu    = sanitize(req.body.url_menu);
    const icon_menu   = req.body.icon_menu;
    const order_menu  = req.body.order_menu;
    const parent_id   = req.body.parent_id || null;
    const component   = req.body.component;

    // SKIP VALIDATION jika "-" atau "#"
    const skipValidation = (url_menu === "-" || url_menu === "#");

    if (!skipValidation) {
      const [exist] = await Menu.checkDuplicateOnUpdate(id, title_menu, url_menu);

      if (exist.length > 0) {
        const errors = {};
        if (exist[0].title_menu === title_menu) {
          errors.title_menu = "Title sudah digunakan";
        }
        if (exist[0].url_menu === url_menu) {
          errors.url_menu = "Url sudah digunakan";
        }
        if (Object.keys(errors).length > 0) {
          return fieldError(errors);
        }
      }
    }

    const data = { title_menu, url_menu, icon_menu, order_menu, parent_id, component };

    const [result] = await Menu.update(id, data);

    if (result.affectedRows === 0) {
      return fieldError({ general: "Menu tidak ditemukan" }, 404);
    }

    res.json({ message: "Menu berhasil diupdate" });

  } catch (err) {
    next(err);
  }
};


exports.deleteMenu = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await Menu.delete(id);
    if (result.affectedRows === 0) {
      return fieldError({ general: "Menu tidak ditemukan" }, 404);
    }

    res.json({ message: "Menu berhasil dihapus" });

  } catch (err) {
    next(err);
  }
};
