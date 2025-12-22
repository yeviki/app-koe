const router = require("express").Router();
const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");
const checkForceLogout = require("../../middlewares/checkForceLogout");
const checkMaintenance = require("../../middlewares/checkMaintenance");

const {
  getTabungan,
  createTabungan,
  updateTabungan,
  deleteTabungan,
} = require("../../controllers/public/tabunganController");

// CRUD TABUNGAN
router.get("/", auth, checkForceLogout, checkMaintenance, role("tabungan", "index"), getTabungan);

router.post(
  "/",
  auth, checkForceLogout, checkMaintenance,
  role("tabungan", "create"),
  createTabungan
);

router.put(
  "/:id",
  auth, checkForceLogout, checkMaintenance,
  role("tabungan", "update"),
  updateTabungan
);

router.delete(
  "/:id",
  auth, checkForceLogout, checkMaintenance,
  role("tabungan", "delete"),
  deleteTabungan
);

module.exports = router;
