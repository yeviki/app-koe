// middlewares/role.js

// Setting Manual role
// module.exports = (...allowedRoles) => {
//   return (req, res, next) => {

//     if (!req.user) {
//       return res.status(401).json({ message: "User tidak terautentikasi" });
//     }

//      if (!allowedRoles.includes(req.user.roles_id)) {
//       return res.status(403).json({ message: "Akses ditolak" });
//     }

//     next();
//   };
// };

// MODE:
// "manual" → menggunakan allowedRoles (seperti sebelumnya)
// "dynamic" → cek izin dari database (tabel syst_roles_permissions)
const MODE = process.env.ROLE_MODE || "manual";

// DB connection (gunakan sesuai project)
const db = require("../config/db");

module.exports = (moduleName, controlName, ...allowedRoles) => {
  return async (req, res, next) => {

    //
    // 1. Pastikan user sudah login dan data req.user sudah tersedia
    //
    if (!req.user) {
      return res.status(401).json({ message: "User tidak terautentikasi" });
    }

    // ❌ Bypass jika moduleName dan controlName null → langsung next()
    if (moduleName === null && controlName === null) {
      return next();
    }

    //
    // 2. MODE MANUAL → gunakan cara lama (allowedRoles)
    //    Tidak pakai database. Persis seperti versi original kamu.
    //
    if (MODE === "manual") {
      // contoh penggunaan: role(null, null, 1, 2, 3)
      if (!allowedRoles.includes(req.user.roles_id)) {
        return res.status(403).json({
          message: "Peringatan.!! Akses tidak berhak terdeteksi memerlukan hak akses tertinggi!!"
        });
      }
      return next(); // lolos
    }

    //
    // 3. MODE DYNAMIC → cek izin berdasarkan tabel:
    //    - syst_roles_permissions
    //    - syst_module
    //    - syst_control
    //    Tanpa mengubah logika utama allowedRoles lama
    //
    if (MODE === "dynamic") {
      try {
        const roleId = req.user.roles_id;

        // Query: ambil permission role → module → control
        const [rows] = await db.query(
          `
          SELECT rp.id
          FROM syst_roles_permissions rp
          JOIN syst_module m ON rp.module_id = m.id
          JOIN syst_control c ON rp.control_id = c.id
          WHERE rp.roles_id = ?
          AND m.module_name = ?
          AND c.control_name = ?
          AND rp.id_status = 1
          `,
          [roleId, moduleName, controlName]
        );

        // Jika tidak ada permission → tolak
        if (rows.length === 0) {
          return res.status(403).json({
            message: "Peringatan.!! Akses tidak berhak terdeteksi memerlukan hak akses tertinggi!!"
          });
        }

        return next(); // lolos akses
      } catch (err) {
        console.error("Error pada middleware role:", err);
        return res.status(500).json({
          message: "Terjadi error pada pengecekan role (dynamic mode)"
        });
      }
    }

    //
    // 4. Jika MODE tidak valid (salah ketik)
    //
    return res.status(500).json({
      message: "Konfigurasi ROLE_MODE tidak valid"
    });
  };
};

