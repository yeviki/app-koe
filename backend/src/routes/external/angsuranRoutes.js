const router = require("express").Router();
const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");
const checkForceLogout = require("../../middlewares/checkForceLogout");
const checkMaintenance = require("../../middlewares/checkMaintenance");

const {
  listAngsuran,
  createAngsuran,
  deleteAngsuran,
  getLaporanAngsuran,
} = require("../../controllers/public/angsuranController");

// ===============================
// LAPORAN (WAJIB DI ATAS)
// ===============================
router.get(
  "/laporan",
  auth, checkForceLogout, checkMaintenance,
  role("angsuran", "report"),
  getLaporanAngsuran
);

// ===============================
// CRUD ANGSURAN
// ===============================
router.get(
  "/:id",
  auth, checkForceLogout, checkMaintenance,
  role("angsuran", "index"),
  listAngsuran
);

router.delete(
  "/:id",
  auth, checkForceLogout, checkMaintenance,
  role("angsuran", "index"),
  deleteAngsuran
);

router.post(
  "/",
  auth, checkForceLogout, checkMaintenance,
  role("angsuran", "create"),
  createAngsuran
);

module.exports = router;
