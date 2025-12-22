// controllers/systemController.js
const ModelSystem = require("../../models/management/systemModel");

// =============================================== //
//   GET STATUS MAINTENANCE + MESSAGE
// =============================================== //
exports.getMaintenanceStatus = async (req, res, next) => {
  try {
    const [rows] = await ModelSystem.getMaintenanceStatus();

    // Default kalau data kosong
    const status = rows.length ? rows[0].value : "0";
    const message = rows.length ? rows[0].message || "" : "";

    return res.json({
      status: Number(status),   // 1 = maintenance, 0 = normal
      message: message
    });
  } catch (err) {
    next(err);
  }
};

// =============================================== //
//   UPDATE / SET MODE MAINTENANCE
// =============================================== //
exports.setMaintenanceMode = async (req, res, next) => {
  try {
    const { status, message = "" } = req.body;
    // ✅ message diberi default ""

    const modeValue = status === "maintenance" ? "1" : "0";

    // ✅ update ke database
    await ModelSystem.updateMaintenanceStatus(modeValue, message);

    if (modeValue === "1") {
      await ModelSystem.forceLogoutNonAdmin();
    } else {
      await ModelSystem.resetForceLogout();
    }

    return res.json({
      success: true,
      message: "Mode aplikasi diperbarui",
      mode: status
    });

  } catch (err) {
    next(err);
  }
};

