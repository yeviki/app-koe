// routes/userRoutes.js
const router = require("express").Router();
const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");

// Deklarasikan seluruh controler yang sudah dibuatkan
const {
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("../../controllers/management/menuController");

// 1 Super Admin
// 2 Local Admin
// 3 Pimpinan
// 4 Staf

// Hanya adminsuper & adminlocal yang boleh CRUD users
// router.get("/", auth, role(null, null, 1, 2, 3), getMenu); contoh jika set manual dan otomatis, jika ingin manual saja silahkan hapus null, null nya
// router.get("/", auth, role(1, 2, 3), getMenu); // setting role manual saja
router.get("/", auth, role("menu", "index"), getMenu);

router.post("/", auth, role("menu", "create"), createMenu);
// SEMENTARA (untuk buat user pertama)
// router.post("/", createMenu);

router.put("/:id", auth, role("menu", "update"), updateMenu);

router.delete("/:id", auth, role("menu", "delete"), deleteMenu);

module.exports = router;
