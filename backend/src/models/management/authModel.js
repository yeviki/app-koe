const db = require("../../config/db");

module.exports = {
    // Tambah Nilai Count Jika Gagal Login
    countFailedLogins(identifier, user_id = null) {
        if (user_id) {
          return db.execute(
            `SELECT COUNT(*) AS failCount
            FROM syst_login_history
            WHERE user_id = ?
              AND status = 'failed'`,
            [user_id]
          );
        } else {
          return db.execute(
            `SELECT COUNT(*) AS failCount
            FROM syst_login_history
            WHERE attempted_email = ?
              AND status = 'failed'`,
            [identifier]
          );
        }
      },
    
      // --- RESET fail count & blokir meta tanpa hapus history
      // Tambahkan blockedUntil agar blokir sementara bisa tersimpan
      updateFailedLoginMeta(user_id, failCount = 0, blockedUntil = null) {
        return db.execute(
          `UPDATE syst_users 
           SET fail_count = ?, blocked_until = ? 
           WHERE id = ?`,
          [failCount, blockedUntil, user_id]
        );
      },
    
      blockUser(id) {
        return db.query(
          `UPDATE syst_users SET blokir = 'YA' WHERE id = ?`,
          [id]
        );
      },
    
      // ------------------------------------------- //
    
      saveLoginHistory(user_id, status, req, attempted_identifier = null) {
        const ip = req.ip;
        const ua = req.headers["user-agent"];
    
        return db.query(
          `INSERT INTO syst_login_history 
            (user_id, attempted_email, login_time, ip_address, user_agent, status) 
            VALUES (?, ?, NOW(), ?, ?, ?)`,
          [user_id, attempted_identifier, ip, ua, status]
        );
      },
    
      updateLogoutTime(user_id) {
        return db.query(
          `UPDATE syst_login_history 
           SET logout_time = NOW() 
           WHERE user_id = ? AND status = 'success' AND logout_time IS NULL
           ORDER BY login_time DESC
           LIMIT 1`,
          [user_id]
        );
      },
    

    // ------------------------------------------- //

    getMenuByRole(roles_id) {
        return db.query(`
        SELECT 
            m.id_menu,
            m.title_menu,
            m.url_menu,
            m.icon_menu,
            m.order_menu,
            m.parent_id,
            m.component
        FROM syst_roles_menu rm
        JOIN syst_menu m ON m.id_menu = rm.menu_id
        WHERE rm.roles_id = ?
            AND rm.id_status = 1
        ORDER BY m.parent_id ASC, m.order_menu ASC
        `, [roles_id]);
    },

    getByIdentifier(identifier) {
        return db.query(
        "SELECT * FROM syst_users WHERE email = ? OR username = ? LIMIT 1",
        [identifier, identifier]
        );
    },
    
    getByIdWithRole(userId, roleId) {
      return db.execute(`
          SELECT 
            us.id,
            us.email,
            m.roles_id,
            rl.roles_name
          FROM syst_users us
          INNER JOIN syst_users_roles m ON m.users_id = us.id
          INNER JOIN syst_roles rl ON rl.id = m.roles_id
          WHERE us.id = ? AND m.roles_id = ?
             AND m.id_status = 1
          LIMIT 1
      `, [userId, roleId]);
    },

    getUserRoles(id) {
      return db.query(`
        SELECT 
          usRole.id,
          usRole.users_id,
          usRole.roles_id,
          usRole.id_status,
          rl.roles_name
        FROM syst_users_roles usRole
        JOIN syst_users m ON m.id = usRole.users_id
        JOIN syst_roles rl ON rl.id = usRole.roles_id
        WHERE usRole.users_id = ?
          AND usRole.id_status = 1
        ORDER BY rl.roles_name DESC, usRole.id ASC
      `, [id]);
    },

};