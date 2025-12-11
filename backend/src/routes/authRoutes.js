// routes/authRoutes.js
const router = require("express").Router();
const { login, selectRole, logout, getMenu, me } = require("../controllers/authController");
const authMiddleware = require("../middlewares/auth");

// 1 Super Admin
// 2 Local Admin
// 3 Pimpinan
// 4 Staf

// POST /auth/login
router.post("/login", login);

router.post("/select-role", selectRole); // <= tambahan

router.post("/logout", authMiddleware, logout);

// GET /auth/me (protected)
router.get("/me", authMiddleware, me);

// Get User Roles Menu
router.get("/menu", authMiddleware, getMenu);

module.exports = router;
