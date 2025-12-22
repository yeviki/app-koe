// routes/masterRoutes.js
const router = require("express").Router();
const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");

// Import controller combobox
const { getComboStatus, getComboRoles, getStats, getComboNasabah } = require("../../controllers/management/masterController");

// GET COMBO STATUS → bypass pengecekan role
router.get("/combo-status", auth, role(null, null), getComboStatus);
router.get("/combo-roles", auth, role(null, null), getComboRoles);

router.get("/stats", getStats);

router.get("/combo-nasabah", auth, role(null, null), getComboNasabah);

module.exports = router;
