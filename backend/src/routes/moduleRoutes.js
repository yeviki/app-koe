// routes/rolesRoutes.js
const router = require("express").Router();
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

// Deklarasikan seluruh controler yang sudah dibuatkan
const {
  getModule,
  createModule,
  updateModule,
  deleteModule
} = require("../controllers/moduleController");

// 1 Super Admin
// 2 Local Admin
// 3 Pimpinan
// 4 Staf

// router.get("/", auth, role(null, null, 1, 2, 3), getMenu); contoh jika set manual dan otomatis, jika ingin manual saja silahkan hapus null, null nya
// router.get("/", auth, role(1, 2, 3), getModule); // setting role manual saja

// CRUD ROLES
router.get("/", auth, role("module", "index"), getModule);
router.post("/", auth, role("module", "create"), createModule);
router.put("/:id", auth, role("module", "update"), updateModule);
router.delete("/:id", auth, role("module", "delete"), deleteModule);

module.exports = router;

