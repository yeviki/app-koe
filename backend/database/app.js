// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ====== MIDDLEWARE DASAR ======
app.use(cors({
  origin: ["http://localhost:5173", "https://domainvuekamu.com"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// ====================== API PING ROUTE ======================
// ============================================================
app.get("/api/ping", (req, res) => {
  res.json({ status: "ok" });
});

// ====== ROUTES ======
app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/roles", require("./routes/rolesRoutes"));
app.use("/api/module", require("./routes/moduleRoutes"));
app.use("/api/control", require("./routes/controlRoutes"));
app.use("/api/system", require("./routes/systemRoutes"));


// Untuk Combobox
app.use("/api/master", require("./routes/masterRoutes"));

// ============================================================
// ============== GLOBAL ERROR HANDLER ========================
// ============================================================
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  if (err.fields) {
    return res.status(err.status || 400).json({
      errors: err.fields,
    });
  }

  return res.status(err.status || 500).json({
    errors: {
      general: err.message || "Terjadi kesalahan pada server",
    },
  });
});

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
