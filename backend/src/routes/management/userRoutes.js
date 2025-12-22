// routes/userRoutes.js
const router = require("express").Router();
const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");
const checkForceLogout = require("../../middlewares/checkForceLogout");
const checkMaintenance = require("../../middlewares/checkMaintenance");

// Deklarasikan seluruh controler yang sudah dibuatkan
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../../controllers/management/userController");

// 1 Super Admin
// 2 Local Admin
// 3 Pimpinan
// 4 Staf

// checkForceLogout
// Berguna untuk check apakah status users sudah di paksa logout atau tidak, jika tidak diberikan akses

// checkMaintenance
// Berguna untuk check apakah status app maintance atau tidak, jika tidak diberikan akses izin menampilkan data

// Hanya adminsuper & adminlocal yang boleh CRUD users
// router.get("/", auth, role(null, null, 1, 2, 3), getMenu); contoh jika set manual dan otomatis, jika ingin manual saja silahkan hapus null, null nya
// router.get("/", auth, role(1, 2, 3), getUsers); // Manual configurasi
router.get("/", auth, checkForceLogout, checkMaintenance, role("users", "index"), getUsers);

// router.post("/", auth, role(1), createUser); // Manual configurasi
router.post("/", auth, checkForceLogout, checkMaintenance, role("users", "create"), createUser);
// SEMENTARA (untuk buat user pertama)
// router.post("/", createUser);

// router.put("/:id", auth, role(1, 2), updateUser); // Manual configurasi
router.put("/:id", auth, checkForceLogout, checkMaintenance, role("users", "update"), updateUser);

// router.delete("/:id", auth, role(1), deleteUser); // Manual configurasi
router.delete("/:id", auth, checkForceLogout, checkMaintenance, role("users", "delete"), deleteUser);

module.exports = router;
