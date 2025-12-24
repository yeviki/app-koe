require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

const excludePaths = [
  "/api/ping",
  "/api/system/mode"
];

// ===============================
// TRUST PROXY
// ===============================
app.set("trust proxy", 1);

// ===============================
// ✅ CORS PALING ATAS
// ===============================
app.use(
  cors({
    origin: "http://localhost:5173", // sementara hardcode untuk tes
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// handle preflight
app.options(/.*/, cors());

// ===============================
// HELMET
// ===============================
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    contentSecurityPolicy: false,
  })
);

// ===============================
// RATE LIMIT
// ===============================
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => excludePaths.includes(req.path),
});

app.use(globalLimiter);

// ===============================
// BODY PARSER
// ===============================
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// ===============================
// ROUTES
// ===============================
app.get("/api/ping", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send("API running...");
});

// ===============================
// API MANAGEMENT PROJECT
// ===============================
app.use("/api/auth", require("./routes/management/authRoutes"));
app.use("/api/users", require("./routes/management/userRoutes"));
app.use("/api/menu", require("./routes/management/menuRoutes"));
app.use("/api/roles", require("./routes/management/rolesRoutes"));
app.use("/api/module", require("./routes/management/moduleRoutes"));
app.use("/api/control", require("./routes/management/controlRoutes"));
app.use("/api/system", require("./routes/management/systemRoutes"));
app.use("/api/master", require("./routes/management/masterRoutes"));

// External Public Routes
// Ambil data file upload dari server atau backend
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);
// Heandle Error Upload
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err.message?.includes("File tidak valid")) {
    return res.status(400).json({
      message: err.message,
    });
  }

  next(err);
});
// ===============================
// API EXTERNAL
// ===============================
app.use("/api/nasabah", require("./routes/external/nasabahRoutes"));


// ===============================
// GLOBAL ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  if (err.fields) {
    return res.status(err.status || 400).json({ errors: err.fields });
  }

  return res.status(err.status || 500).json({
    errors: { general: err.message || "Terjadi kesalahan pada server" },
  });
});

// ===============================
// 404 HANDLER
// ===============================
app.use((req, res) => {
  res.status(404).json({
    errors: { general: "Endpoint tidak ditemukan" },
  });
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
