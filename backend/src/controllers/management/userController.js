// controllers/userController.js
const bcrypt = require("bcryptjs");
const User = require("../../models/management/userModel");
const { isEmail, isStrongPassword, sanitize } = require("../../utils/validate");

// Helper untuk error per-field
const fieldError = (fields, code = 400) => {
  const err = new Error("Validation Error");
  err.status = code;
  err.fields = fields; // <-- penting!
  throw err;
};

exports.getUsers = async (req, res, next) => {
  try {
    // token sekarang harus punya: req.user.roles_id = [1,2,3]
    let currentRoles = req.user.roles_id;

    // normalisasi jadi array
    if (!Array.isArray(currentRoles)) {
      currentRoles = currentRoles ? [currentRoles] : [];
    }

    // ambil role utama (biasanya paling kecil / tertinggi)
    const primaryRole = currentRoles.length > 0
      ? parseInt(currentRoles[0])
      : null;

    if (!primaryRole) {
      return res
        .status(400)
        .json({ message: "Data tidak ditemukan dalam token" });
    }

    const [rows] = await User.getAllFiltered(primaryRole);

    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const fullname  = sanitize(req.body.fullname);
    const username  = sanitize(req.body.username);
    const email     = sanitize(req.body.email);
    const password  = req.body.password;
    let roles_id    = req.body.roles_id;
    const blokir    = req.body.blokir;
    const id_status = req.body.id_status;

    // ✅ Pastikan roles_id selalu array
    if (!Array.isArray(roles_id)) {
      roles_id = roles_id ? [roles_id] : [];
    }

    // Validasi
    if (!isEmail(email)) {
      return fieldError({ email: "Format email tidak valid" });
    }

    if (!isStrongPassword(password)) {
      return fieldError({ password: "Password minimal 6 karakter" });
    }

    const [exist] = await User.checkDuplicate(username, email);
    if (exist.length > 0) {
      const errors = {};
      if (exist[0].username === username) {
        errors.username = "Username sudah digunakan user lain";
      }
      if (exist[0].email === email) {
        errors.email = "Email sudah digunakan user lain";
      }
      if (Object.keys(errors).length > 0) {
        return fieldError(errors);
      }
    }

    // Hash
    const hash = await bcrypt.hash(password, 10);

    // ✅ Insert user
    const userId = await User.create({
      fullname,
      username,
      email,
      password: hash,
      blokir,
      id_status
    });

    // ✅ Simpan roles ke pivot table
    for (const roleId of roles_id) {
      await User.insertUserRole(userId, roleId);
    }

    res.json({ message: "User berhasil ditambahkan" });

  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const fullname  = sanitize(req.body.fullname);
    const username  = sanitize(req.body.username);
    const email     = sanitize(req.body.email);
    let roles_id    = req.body.roles_id; // ✅ array
    const password  = req.body.password;
    const blokir    = req.body.blokir;
    const id_status = req.body.id_status;

    // ✅ pastikan roles_id selalu array
    if (!Array.isArray(roles_id)) {
      roles_id = roles_id ? [roles_id] : [];
    }

    if (!isEmail(email)) {
      return fieldError({ email: "Format email tidak valid" });
    }

    // cek duplikasi
    const [exist] = await User.checkDuplicateOnUpdate(id, username, email);
    if (exist.length > 0) {
      const errors = {};
      if (exist[0].username === username) {
        errors.username = "Username sudah digunakan user lain";
      }
      if (exist[0].email === email) {
        errors.email = "Email sudah digunakan user lain";
      }
      if (Object.keys(errors).length > 0) {
        return fieldError(errors);
      }
    }

    // ✅ data tanpa roles_id
    const data = { fullname, username, email, blokir, id_status };

    // password optional
    if (password && password.trim() !== "") {
      if (!isStrongPassword(password)) {
        return fieldError({ password: "Password minimal 6 karakter" });
      }
      const hashed = await bcrypt.hash(password, 10);
      data.password = hashed;
    }

    // update user
    const [result] = await User.update(id, data);

    if (result.affectedRows === 0) {
      return fieldError({ general: "User tidak ditemukan" }, 404);
    }

    // ✅ update roles pivot
    // await User.clearUserRoles(id);

    // ✅ Ambil roles lama user
    const [existingRoles] = await User.getUserRoles(id);
    const existingRoleIds = existingRoles.map(r => String(r.roles_id));

    // ✅ roles yang dicentang sekarang
    const newRoleIds = roles_id.map(r => String(r));

    // 1️⃣ Aktifkan role yang dicentang
    for (const roleId of newRoleIds) {
      if (existingRoleIds.includes(roleId)) {
        await User.updateUserRoleStatus(id, roleId, 1);
      } else {
        await User.insertUserRoleWithStatus(id, roleId, 1);
      }
    }

    // 2️⃣ Nonaktifkan role yang di-uncheck
    for (const roleId of existingRoleIds) {
      if (!newRoleIds.includes(roleId)) {
        await User.updateUserRoleStatus(id, roleId, 0);
      }
    }

    res.json({ message: "User berhasil diupdate" });

  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ✅ hapus roles relasi dulu
    await User.clearUserRoles(id);

    // ✅ hapus user
    const [result] = await User.delete(id);
    if (result.affectedRows === 0) {
      return fieldError({ general: "User tidak ditemukan" }, 404);
    }

    res.json({ message: "User berhasil dihapus" });

  } catch (err) {
    next(err);
  }
};

