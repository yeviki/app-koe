// controllers/masterController.js
const ModelData = require("../models/masterModel");
const dayjs = require("dayjs");
require("dayjs/locale/id");
dayjs.locale("id");

exports.getComboStatus = async (req, res, next) => {
  try {
    const [rows] = await ModelData.getComboStatus();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getComboRoles = async (req, res, next) => {
  try {
    const currentRole = req.user.roles_id;

    if (!currentRole) {
      return res.status(400).json({ message: "Roles tidak ditemukan dalam token" });
    }

    const [rows] = await ModelData.getComboAkses(currentRole);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const [users] = await ModelData.getTotalUsers();
    const [roles] = await ModelData.getTotalRoles();
    const [last] = await ModelData.getLastLogin();
    return res.json({
      users: users[0]?.total || 0,
      roles: roles[0]?.total || 0,
      lastLogin: last[0]?.login_time
      ? dayjs(last[0].login_time).format("dddd, DD MMMM YYYY HH:mm")
      : "-",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Gagal mengambil statistik",
      error: err.message,
    });
  }
};
