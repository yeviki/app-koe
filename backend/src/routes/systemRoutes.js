// routes/systemRoutes.js
const router = require("express").Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const db = require("../config/db");

const {
  getMaintenanceStatus,
  setMaintenanceMode
} = require("../controllers/systemController");

// -----------------------------
// SYSTEM SETTINGS
// -----------------------------

// Ambil status maintenance
router.get(
  "/maintenance-status",
  auth,
  role(null, null),
  getMaintenanceStatus
);

// Set mode maintenance / normal
router.post(
  "/set-maintenance",
  auth,
  role(null, null),
  setMaintenanceMode
);

// GET /system/mode
router.get("/mode", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT value, message FROM syst_app_settings WHERE `key` = 'application_mode' LIMIT 1"
    );

    const isMaintenance = rows.length ? rows[0].value == "1" : false;

    res.json({
      // konsisten dengan frontend
      mode: isMaintenance ? "maintenance" : "normal",

      // gunakan pesan custom jika ada
      message:
        (rows.length && rows[0].message)
          ? rows[0].message
          : isMaintenance
            ? "Sistem sedang dalam mode maintenance."
            : "Sistem berjalan normal."
    });

  } catch (err) {
    console.error("GET /system/mode ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
