// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Mauth = require("../models/authModel");

// --- Controller ---
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const identifier = email; // email atau username
  const now = new Date();

  // --- ambil data user ---
  const [rows] = await Mauth.getByIdentifier(identifier);
  const userExists = rows.length > 0;
  const user = userExists ? rows[0] : null;

  // --- cek user diblokir / tidak aktif ---
  if (user) {
    if (user.blokir === "Ya") {
      return res.status(403).json({ message: "Akun Anda telah diblokir!, Silahkan hubungi admin.!" });
    }
    if (user.id_status !== "Aktif") {
      return res.status(403).json({ message: "Akun Anda tidak aktif" });
    }
    if (user.force_logout !== 0) {
      return res.status(403).json({ message: "Sistem sedang dalam perbaikan, Harap coba lagi nanti" });
    }
  }

  // --- user tidak ditemukan ---
  if (!userExists) {
    // --- simpan histori login jika gagal ---
    await Mauth.saveLoginHistory(null, "failed", req, identifier);

    // --- update fail_count tambah count jika gagal di tabel user ---
    const [failRaw] = await Mauth.countFailedLogins(identifier);

    const failCount = failRaw[0].failCount || 0;
    const sisa = 10 - failCount;

    if (failCount >= 10) {
      return res.status(403).json({ message: "Akun diblokir karena terlalu banyak percobaan login gagal" });
    }

    if (failCount >= 5) {
      return res.status(400).json({
        message: `Login gagal, Anda sudah ${failCount} kali gagal. Kesempatan tinggal ${sisa} kali lagi.`
      });
    }

    return res.status(400).json({ message: "Email atau Username tidak ditemukan" });
  }

  // --- user valid → cek password ---
  const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
    const now = new Date();
    let failCount = (user.fail_count || 0) + 1; // ambil fail_count dari user + 1
    let blockedUntil = null;
    const baseLock = 1; // menit untuk setiap gagal login

    // --- cek blokir sementara ---
    if (failCount >= 5 && failCount < 10) {
      blockedUntil = new Date(now.getTime() + baseLock * (failCount - 4) * 60 * 1000);
    }

    // --- update fail_count & blocked_until di tabel user ---
    await Mauth.updateFailedLoginMeta(user.id, failCount, blockedUntil);

    // --- simpan history ---
    await Mauth.saveLoginHistory(user.id, "failed", req, identifier);

    // --- BLOKIR PERMANEN ---
    if (failCount >= 10) {
      // --- Set blokir users berdasarkan id ---  
      await Mauth.blockUser(user.id);

      return res.status(403).json({
        message: "Akun diblokir karena terlalu banyak percobaan login gagal! Hubungi admin."
      });
    }

    const sisa = 10 - failCount;
    if (blockedUntil && now < blockedUntil) {
      const remaining = Math.ceil((blockedUntil - now) / 1000);
      return res.status(403).json({
        message: `Akun sementara terkunci. Percobaan gagal ke-${failCount}. Silahkan tunggu sampai ${blockedUntil.toLocaleTimeString()} (${Math.ceil((blockedUntil - now)/60000)} menit).`,
        blockedUntil: blockedUntil.toISOString(),
        remainingSeconds: remaining,
        failCount
      });
    }

    return res.status(failCount >= 5 ? 401 : 400).json({
      message: `Username atau Password salah. Percobaan gagal ke-${failCount}. Kesempatan tinggal ${sisa} kali lagi.`,
      failCount
    });
  }

  // --- login berhasil ---
  await Mauth.saveLoginHistory(user.id, "success", req, identifier);

  // --- reset fail count & unblock user ---
  await Mauth.updateFailedLoginMeta(user.id, 0);

  // --- generate token ---
  const token = jwt.sign(
    { id: user.id, roles_id: user.roles_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );

  return res.json({
    message: "Login berhasil",
    token,
    user: { id: user.id, name: user.name, roles_id: user.roles_id },
  });
};

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   // email → sebenarnya identifier (bisa email atau username)
//   const identifier = email;

//   const [rows] = await User.getByIdentifier(identifier);

//   if (rows.length === 0) {
//     // simpan login gagal, user_id = null
//     await User.saveLoginHistory(null, "failed", req, identifier);
//     return res.status(400).json({ message: "Email atau Username tidak ditemukan" });
//   }

//   const user = rows[0];

//   const valid = await bcrypt.compare(password, user.password);
//   if (!valid) {
//     // simpan login gagal
//     await User.saveLoginHistory(user.id, "failed", req, identifier);
//     return res.status(400).json({ message: "Password salah" });
//   }

//   // login berhasil → simpan history
//   await User.saveLoginHistory(user.id, "success", req, identifier);

//   const token = jwt.sign(
//     { id: user.id, roles_id: user.roles_id },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES }
//   );

//   return res.json({
//     message: "Login berhasil",
//     token,
//     user: { id: user.id, name: user.name, roles_id: user.roles_id },
//   });
// };

exports.getMenu = async (req, res) => {
  const roles_id = req.user.roles_id;

  // --- Get Menu Dinamis By Roles ID Users ---
  const [rows] = await Mauth.getMenuByRole(roles_id);

  res.json({
    success: true,
    menu: rows,
  });
};

// ---- GET /auth/me ----
exports.me = async (req, res) => {
  // --- Get By Id ---
  const [rows] = await Mauth.getById(req.user.id);

  if (rows.length === 0) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }

  const user = rows[0];

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    roles_id: user.roles_id,
    roles_name: user.roles_name,
  });
};

exports.logout = async (req, res) => {
  try {
    const user_id = req.user.id; // ambil dari JWT middleware
    const token = req.headers.authorization?.split(' ')[1];

    if (!user_id) {
      return res.status(400).json({ message: "User tidak ditemukan" });
    }

    // update logout_time di record login terakhir user yang status = 'success' dan logout_time masih NULL
    await Mauth.updateLogoutTime(user_id);

    return res.json({ message: "Logout berhasil" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Terjadi kesalahan" });
  }
};

