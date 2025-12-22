const router = require("express").Router();
const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");
const checkForceLogout = require("../../middlewares/checkForceLogout");
const checkMaintenance = require("../../middlewares/checkMaintenance");

const {
  getPinjaman,
  createPinjaman,
  updatePinjaman,
  deletePinjaman,
} = require("../../controllers/public/pinjamanController");

// CRUD PINJAMAN
router.get("/", auth, checkForceLogout, checkMaintenance, role("pinjaman", "index"), getPinjaman);

router.post(
  "/",
  auth, checkForceLogout, checkMaintenance,
  role("pinjaman", "create"),
  createPinjaman
);

router.put(
  "/:id",
  auth, checkForceLogout, checkMaintenance,
  role("pinjaman", "update"),
  updatePinjaman
);

router.delete(
  "/:id",
  auth, checkForceLogout, checkMaintenance,
  role("pinjaman", "delete"),
  deletePinjaman
);

module.exports = router;
