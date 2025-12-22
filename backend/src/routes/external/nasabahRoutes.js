const router = require("express").Router();
const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");
const checkForceLogout = require("../../middlewares/checkForceLogout");
const checkMaintenance = require("../../middlewares/checkMaintenance");

const uploadFactory = require("../../middlewares/upload");

const {
  getNasabah,
  createNasabah,
  updateNasabah,
  deleteNasabah,
} = require("../../controllers/public/nasabahController");

// upload khusus nasabah
const uploadNasabah = uploadFactory({
  fields: [
      { name: "foto_ktp", maxCount: 1 },
      { name: "foto_nasabah", maxCount: 1 },
      { name: "foto_rumah", maxCount: 1 },
      { name: "foto_usaha", maxCount: 1 },
      { name: "foto_promise", maxCount: 1 },
    ],
  destination: "uploads/nasabah",
  allowedMime: [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ],
  maxSize: 2 * 1024 * 1024,
});

// CRUD NASABAH
router.get("/", auth, checkForceLogout, checkMaintenance, role("nasabah", "index"), getNasabah);

router.post(
  "/",
  auth, checkForceLogout, checkMaintenance,
  role("nasabah", "create"),
  uploadNasabah,
  createNasabah
);

router.put(
  "/:id",
  auth, checkForceLogout, checkMaintenance,
  role("nasabah", "update"),
  uploadNasabah,
  updateNasabah
);

router.delete(
  "/:id",
  auth, checkForceLogout, checkMaintenance,
  role("nasabah", "delete"),
  deleteNasabah
);

module.exports = router;
