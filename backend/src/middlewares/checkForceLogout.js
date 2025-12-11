// middlewares/checkForceLogout.js
const db = require("../config/db");

module.exports = async function checkForceLogout(req, res, next) {
  try {
    // Jika belum login → skip
    if (!req.user || !req.user.id) return next();

    const [rows] = await db.query(
      "SELECT force_logout FROM syst_users WHERE id = ? LIMIT 1",
      [req.user.id]
    );

    if (rows.length === 0) return next();

    // Jika force_logout = 1 → paksa logout
    if (rows[0].force_logout == 1) {
      return res.status(440).json({
        success: false,
        forceLogout: true,
        message: "Anda telah dikeluarkan karena sistem dalam mode maintenance.",
      });
    }

    next();
  } catch (err) {
    console.error("checkForceLogout ERROR:", err);
    next(err);
  }
};
