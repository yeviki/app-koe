// routes/rolesRoutes.js
const router = require("express").Router();
const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");

// Import controller
const {
  getRoles,
  createRoles,
  updateRoles,
  deleteRoles,
  getMenu,
  getRoleMenus,
  updateRoleMenus,
  getPermissionGrouped,
  updateStatusPermission,
  deletePermission,
  savePermission, // <-- tambahkan
} = require("../../controllers/management/rolesController");

const {
  getModule
} = require("../../controllers/management/moduleController");

const {
  getControl
} = require("../../controllers/management/controlController");

// --------------------------------------
// ROLE SETTINGS
// 1 Super Admin
// 2 Local Admin
// 3 Pimpinan
// 4 Staf
// --------------------------------------

// CRUD ROLES
router.get("/", auth, role("roles", "index"), getRoles);
router.post("/", auth, role("roles", "create"), createRoles);
router.put("/:id", auth, role("roles", "update"), updateRoles);
router.delete("/:id", auth, role("roles", "delete"), deleteRoles);

// --------------------------------------
// MENU MANAGEMENT
// --------------------------------------

// list semua menu
router.get("/menu/all", auth, role("roles", "detailList"), getMenu);

// tampilkan menu milik role tertentu dan checklist menu yang terdaftar
router.get("/:id/menus", auth, role("roles", "setDetail"), getRoleMenus);

// update menu yg dimiliki role
router.post("/:id/menus", auth, role("roles", "updateDetail"), updateRoleMenus);

// --------------------------------------
// PERMISSION MANAGEMENT
// --------------------------------------

// Ambil Data Module dan Control untuk Combobox
// router.get("/getModule", auth, role("roles", "detailList"), getModule);
// router.get("/getControl", auth, role("roles", "detailList"), getControl);

// 1. Simpan permission baru
router.post(
  "/permission",
  auth,
  role("roles", "setDetail"),   // hanya super admin
  savePermission
);

// 2. Ambil permission (group by module -> control)
router.get(
  "/permission/:id/grouped",
  auth,
  role("roles", "detailList"),
  getPermissionGrouped
);

// 3. Update status permission id (aktif/nonaktif)
router.post(
  "/permission/:id/status",
  auth,
  role("roles", "updateDetail"),
  updateStatusPermission
);

// 4. Hapus permission tertentu
router.delete(
  "/permission/:id",
  auth,
  role("roles", "deleteDetail"),  // hanya super admin
  deletePermission
);

module.exports = router;
