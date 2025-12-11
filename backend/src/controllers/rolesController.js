// controllers/rolesController.js
const ModelData = require("../models/rolesModel");
const { sanitize } = require("../utils/validate");

// Helper untuk error per-field
const fieldError = (fields, code = 400) => {
  const err = new Error("Validation Error");
  err.status = code;
  err.fields = fields; // <-- penting!
  throw err;
};

exports.getRoles = async (req, res, next) => {
  try {
    const [rows] = await ModelData.getAll();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.createRoles = async (req, res, next) => {
  try {
    const roles_name  = sanitize(req.body.roles_name);

    // VALIDASI DUPLIKAT
    const [exist] = await ModelData.checkDuplicate(roles_name);
    if (exist.length > 0) {
      const errors = {};

      if (exist[0].roles_name === roles_name) {
        errors.roles_name = "Nama roles sudah digunakan";
      }
      if (Object.keys(errors).length > 0) {
        return fieldError(errors);
      }
    }

    // SIMPAN
    await ModelData.create({ roles_name });

    res.json({ message: "Roles berhasil ditambahkan" });

  } catch (err) {
    next(err);
  }
};

exports.updateRoles = async (req, res, next) => {
  try {
    const { id } = req.params;

    const roles_name = sanitize(req.body.roles_name);

    const [exist] = await ModelData.checkDuplicateOnUpdate(id, roles_name);

    if (exist.length > 0) {
      const errors = {};
      if (exist[0].roles_name === roles_name) {
        errors.roles_name = "Roles sudah digunakan";
      }
      if (Object.keys(errors).length > 0) {
        return fieldError(errors);
      }
    }

    const data = { roles_name };

    const [result] = await ModelData.update(id, data);

    if (result.affectedRows === 0) {
      return fieldError({ general: "Roles tidak ditemukan" }, 404);
    }

    res.json({ message: "Roles berhasil diupdate" });

  } catch (err) {
    next(err);
  }
};

exports.deleteRoles = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await ModelData.delete(id);
    if (result.affectedRows === 0) {
      return fieldError({ general: "Roles tidak ditemukan" }, 404);
    }

    res.json({ message: "Roles berhasil dihapus" });

  } catch (err) {
    next(err);
  }
};

// --------------------------------------------- //
// Detail Roles Menu
exports.getMenu = async (req, res, next) => {
  try {
    const [rows] = await ModelData.getAllMenu();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getRoleMenus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await ModelData.getRoleMenus(id);

    res.json(rows.map(r => r.menu_id));
  } catch (err) {
    next(err);
  }
};

// exports.updateRoleMenus = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const menu_ids = req.body.menu_ids || [];

//     // Hapus semua menu lama
//     await ModelData.deleteRoleMenus(id);

//     // Simpan kembali menu baru
//     if (menu_ids.length > 0) {
//       await ModelData.addRoleMenus(id, menu_ids);
//     }

//     res.json({ message: "Hak akses berhasil diperbarui" });
//   } catch (err) {
//     next(err);
//   }
// };

exports.updateRoleMenus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const menu_ids = req.body.menu_ids || [];

    // 1. Ambil menu yg sudah tersimpan untuk role ini
    const [existing] = await ModelData.getAllRoleMenus(id);
    const existingIds = existing.map(r => r.menu_id);

    // 2. Loop semua menu yg dikirim dari frontend
    for (let menu_id of menu_ids) {

      // Jika sudah ada → UPDATE id_status = 1
      if (existingIds.includes(menu_id)) {
        await ModelData.updateRoleMenuStatus(id, menu_id, 1);
      } else {
        // Jika belum ada → INSERT baru
        await ModelData.insertRoleMenu(id, menu_id);
      }
    }

    // 3. Menu yg tidak dipilih → UPDATE id_status = 0
    for (let oldMenuId of existingIds) {
      if (!menu_ids.includes(oldMenuId)) {
        await ModelData.updateRoleMenuStatus(id, oldMenuId, 0);
      }
    }

    res.json({ message: "Hak akses berhasil diperbarui" });
  } catch (err) {
    next(err);
  }
};

// --------------------------------------------- //


// --------------------------------------------- //
// controllers/rolesController.js
// Detail Roles Permission
// --------------------------------------------- //
exports.getPermissionGrouped = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await ModelData.getAllPermissionWithModuleControl(id);

    // Jika tidak ada data, tetap kirim array kosong
    if (!rows || rows.length === 0) {
      return res.json([]);
    }

    const grouped = {};

    rows.forEach(r => {
      if (!grouped[r.module_id]) {
        grouped[r.module_id] = {
          module_id: r.module_id,
          module_name: r.module_name,
          controls: []
        };
      }

      grouped[r.module_id].controls.push({
        id: r.id,
        control_id: r.control_id,
        control_name: r.control_name,
        label_control: r.label_control,
        id_status: r.id_status
      });
    });

    res.json(Object.values(grouped)); // array hasil grouping
  } catch (err) {
    next(err);
  }
};

exports.updateStatusPermission = async (req, res) => {
  try {
    const id = req.params.id;
    const { id_status } = req.body;

    if (id_status === undefined) {
      return res.status(400).json({
        success: false,
        message: "id_status required"
      });
    }

    const result = await ModelData.updatePermissionStatus(id, id_status);

    if (!result || result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to update"
      });
    }

    return res.json({
      success: true,
      message: "Status updated",
      id,
      id_status
    });

  } catch (err) {
    console.error("Error update status:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

exports.deletePermission = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await ModelData.deletePermRoles(id);
    if (result.affectedRows === 0) {
      return fieldError({ general: "Permission roles tidak ditemukan" }, 404);
    }

    res.json({ message: "Permission roles berhasil dihapus" });

  } catch (err) {
    next(err);
  }
};

exports.savePermission = async (req, res) => {
  try {
    const { roles_id, module_id, control_id, id_status } = req.body;

    if (!roles_id || !module_id) {
      return res.status(400).json({
        message: "roles_id dan module_id wajib diisi"
      });
    }

    if (!control_id || (Array.isArray(control_id) && control_id.length === 0)) {
      return res.status(400).json({
        message: "Minimal pilih satu control"
      });
    }

    // Pastikan array of id
    const controlIds = Array.isArray(control_id) ? control_id.map(c => c.id ?? c) : [control_id];

    // -----------------------------
    // AMBIL CONTROL YANG SUDAH ADA
    // -----------------------------
    const existingControls = await ModelData.getExistingControls(roles_id, module_id);

    // filter controlIds baru
    const newControlIds = controlIds.filter(id => !existingControls.includes(id));

    if (newControlIds.length === 0) {
      return res.json({
        success: true,
        message: "Tidak ada control baru untuk disimpan"
      });
    }

    // -----------------------------
    // SIMPAN CONTROL BARU
    // -----------------------------
    const result = await ModelData.savePermission(roles_id, module_id, newControlIds, id_status ?? 1);

    return res.json({
      success: true,
      message: "Permission berhasil disimpan",
      inserted: result[0]?.affectedRows ?? null
    });

  } catch (error) {
    console.error("❌ ERROR savePermission:", error);
    return res.status(500).json({
      message: "Gagal menyimpan permission",
      error: error.message
    });
  }
};

// Control setting configurasi aplikasi maintenance / normal
exports.setMaintenanceMode = async (req, res) => {
  const { mode } = req.body;

  await db.query(
    "UPDATE app_settings SET value = ? WHERE key='application_mode'",
    [mode]
  );

  if (mode === "maintenance") {
    // logout paksa semua user
    await db.query("UPDATE users SET force_logout = 1");
  }

  return res.json({ status: true, message: "Mode aplikasi diperbarui" });
};








