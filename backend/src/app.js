require("dotenv").config();
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

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/roles", require("./routes/rolesRoutes"));
app.use("/api/module", require("./routes/moduleRoutes"));
app.use("/api/control", require("./routes/controlRoutes"));
app.use("/api/system", require("./routes/systemRoutes"));
app.use("/api/master", require("./routes/masterRoutes"));

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
