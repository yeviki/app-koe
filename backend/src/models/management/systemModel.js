// models/systemModel.js
const db = require("../../config/db");

module.exports = {

  // Ambil status maintenance
  getMaintenanceStatus() {
    return db.query(
      "SELECT value, message FROM syst_app_settings WHERE `key` = 'application_mode'"
    );
  },

  // Update mode maintenance
  updateMaintenanceStatus(value, message = "") {
    return db.query(
      "UPDATE syst_app_settings SET value = ?, message = ? WHERE `key` = 'application_mode'",
      [value, message || ""]
    );
  },

  // ✅ Paksa logout user SELAIN yang punya role admin (roles_id = 1)
  forceLogoutNonAdmin() {
    return db.query(`
      UPDATE syst_users u
      SET u.force_logout = 1
      WHERE NOT EXISTS (
        SELECT 1
        FROM syst_users_roles ur
        WHERE ur.users_id = u.id
        AND ur.roles_id = 1
      )
    `);
  },

  // Kembalikan force_logout menjadi 0
  resetForceLogout() {
    return db.query(`
      UPDATE syst_users 
      SET force_logout = 0
      WHERE force_logout = 1
    `);
  }
};
