const router = require("express").Router();

const auth = require("../../middlewares/auth");
const role = require("../../middlewares/role");
const checkForceLogout = require("../../middlewares/checkForceLogout");
const checkMaintenance = require("../../middlewares/checkMaintenance");

const {
  totalSetorHariIni,
  totalKeuntunganBulanan,
  grafikSetoran,
  grafikKeuntunganBulanan,
  grafikKeuangan,
  nasabahJatuhTempoHariIni,
} = require("../../controllers/public/dashboardController");

// ===============================
// DASHBOARD - CARD
// ===============================
router.get(
  "/total-setor-hari-ini",
  auth,
  checkForceLogout,
  checkMaintenance,
  role(null, null),
  totalSetorHariIni
);

router.get(
  "/total-keuntungan-bulan",
  auth,
  checkForceLogout,
  checkMaintenance,
  role(null, null),
  totalKeuntunganBulanan
);

// ===============================
// DASHBOARD - GRAFIK
// ===============================
router.get(
  "/grafik-setoran",
  auth,
  checkForceLogout,
  checkMaintenance,
  role(null, null),
  grafikSetoran
);

router.get(
  "/grafik-keuntungan-bulanan",
  auth,
  checkForceLogout,
  checkMaintenance,
  role(null, null),
  grafikKeuntunganBulanan
);

router.get(
  "/grafik-keuangan",
  auth,
  checkForceLogout,
  checkMaintenance,
  role(null, null),
  grafikKeuangan
)
router.get(
  "/nasabah-jatuh-tempo-hari-ini",
  auth,
  checkForceLogout,
  checkMaintenance,
  role(null, null),
  nasabahJatuhTempoHariIni
);

module.exports = router;
