// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Mauth = require("../../models/management/authModel");

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
    await Mauth.saveLoginHistory(null, "failed", req, identifier);

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
    let failCount = (user.fail_count || 0) + 1;
    let blockedUntil = null;
    const baseLock = 1;

    if (failCount >= 5 && failCount < 10) {
      blockedUntil = new Date(now.getTime() + baseLock * (failCount - 4) * 60 * 1000);
    }

    await Mauth.updateFailedLoginMeta(user.id, failCount, blockedUntil);
    await Mauth.saveLoginHistory(user.id, "failed", req, identifier);

    if (failCount >= 10) {
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

  // ============================================================================
  // 🔥🔥🔥 TAMBAHAN DI SINI → CEK JUMLAH ROLES USER
  // ============================================================================

  // ambil semua roles user
  const [roleRows] = await Mauth.getUserRoles(user.id);

  // 🔥 FILTER: hanya role yang aktif (id_status = 1)
  const activeRoles = roleRows.filter(r => r.id_status == 1);

  // ==========================
  // Jika TIDAK ADA role aktif
  // ==========================
  if (activeRoles.length === 0) {
    return res.status(403).json({
      noActiveRole: true,
      message: "Tidak ada izin yang aktif untuk akun Anda. Silahkan hubungi Admin."
    });
  }

  // mapping role structure
  const roles = roleRows.map(r => ({
    roles_id: r.roles_id,
    roles_name: r.roles_name
  }));

  // --- jika user hanya punya 1 role → langsung login ---
  if (roles.length === 1) {
    const token = jwt.sign(
      {
        id: user.id,
        roles_id: roles[0].roles_id
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    return res.json({
      message: "Login berhasil",
      directLogin: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        roles_id: roles[0].roles_id
      }
    });
  }

  // --- jika user punya lebih dari 1 role → minta pilih role ---
  // --- jika user punya lebih dari 1 role → minta pilih role ---
  const roleCount = roles.length;

  // Default message
  let infoMessage = "Pilih roles untuk melanjutkan";

  // Jika role lebih dari 1, tampilkan pesan informasi
  if (roleCount > 1) {
    infoMessage = `Informasi!\nAnda memiliki ${roleCount} group untuk bisa login, pilih salah satu untuk lanjut.`;
  }

  return res.json({
    message: infoMessage,
    needSelectRole: true,
    roleCount: roleCount,
    user: {
      id: user.id,
      name: user.name
    },
    roles
  });

  // ============================================================================
  // END TAMBAHAN
  // ============================================================================
};

// --- pilih role setelah login ---
exports.selectRole = async (req, res) => {
  try {
    const { user_id, roles_id } = req.body;

    if (!user_id || !roles_id) {
      return res.status(400).json({ message: "User ID dan Roles ID wajib dikirim" });
    }

    // generate token berdasarkan role yg dipilih
    const token = jwt.sign(
      { id: user_id, roles_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    return res.json({
      message: "Login berhasil dengan role terpilih",
      token,
    });

  } catch (err) {
    console.error("selectRole error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
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
  const userId = req.user.id;
  const rolesId = req.user.roles_id; // <-- ROLE YANG DIPILIH
  
  const [rows] = await Mauth.getByIdWithRole(userId, rolesId);

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

