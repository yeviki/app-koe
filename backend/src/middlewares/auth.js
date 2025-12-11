// middlewares/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    // Verifikasi token (auto catch expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // pastikan token memuat roles_id
    // (tidak mengubah logika, hanya memastikan field ada)
    req.user = decoded; // id, roles_id, dll…

    next();

  } catch (err) {
    console.error("Auth Middleware Error:", err.message);

    // Token expired / invalid harusnya status 401
    return res.status(401).json({ message: "Token invalid atau expired" });
  }
};
