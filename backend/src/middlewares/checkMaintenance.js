// middlewares/checkMaintenance.js
const db = require("../config/db");

module.exports = async function checkMaintenance(req, res, next) {
  try {
    const [rows] = await db.query(
      "SELECT value FROM syst_app_settings WHERE `key` = 'application_mode' LIMIT 1"
    );

    const isMaintenance = rows.length ? rows[0].value == "1" : false;

    // Jika TIDAK maintenance → lanjut
    if (!isMaintenance) return next();

    // Jika maintenance → admin tetap boleh masuk
    if (req.user && req.user.roles_id == 1) return next();

    // Selain admin → tampilkan halaman maintenance
    return res.status(503).json({
      maintenance: true,
      message: "Sistem sedang dalam mode maintenance. Silakan kembali lagi nanti."
    });

  } catch (err) {
    console.error("checkMaintenance ERROR:", err);
    next(err);
  }
};
