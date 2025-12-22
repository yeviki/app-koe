// models/userModel.js
const db = require("../../config/db");

module.exports = {

  // ===============================
  // GET ALL FILTERED (roles aktif saja)
  // ===============================
  getAllFiltered(currentRole) {
    let query = `
      SELECT 
        us.*,
        GROUP_CONCAT(
          CASE 
            WHEN ur.id_status = 1 THEN rl.roles_name
          END 
          SEPARATOR ', '
        ) AS roles_name,
        GROUP_CONCAT(
          CASE 
            WHEN ur.id_status = 1 THEN rl.id
          END 
          SEPARATOR ','
        ) AS roles_ids
      FROM syst_users us
      LEFT JOIN syst_users_roles ur 
        ON ur.users_id = us.id
      LEFT JOIN syst_roles rl 
        ON rl.id = ur.roles_id
    `;

    const params = [];

    // hide superadmin jika role saat login = local admin
    if (currentRole === 2) {
      query += ` 
        WHERE us.id NOT IN (
          SELECT users_id 
          FROM syst_users_roles 
          WHERE roles_id = ?
          AND id_status = 1
        ) 
      `;
      params.push(1);
    }

    query += `
      GROUP BY us.id
      ORDER BY us.id ASC
    `;

    return db.query(query, params);
  },


  // ===============================
  // GET ALL (roles aktif saja)
  // ===============================
  getAll() {
    return db.query(`
      SELECT 
        us.*,
        GROUP_CONCAT(
          CASE 
            WHEN ur.id_status = 1 THEN rl.roles_name
          END 
          SEPARATOR ', '
        ) AS roles_name,
        GROUP_CONCAT(
          CASE 
            WHEN ur.id_status = 1 THEN rl.id
          END 
          SEPARATOR ','
        ) AS roles_ids
      FROM syst_users us
      LEFT JOIN syst_users_roles ur 
        ON ur.users_id = us.id
      LEFT JOIN syst_roles rl 
        ON rl.id = ur.roles_id
      GROUP BY us.id
      ORDER BY us.id ASC
    `);
  },

  // ===============================
  // CREATE USER (tanpa roles_id)
  // ===============================
  async create(data) {
    const [result] = await db.query(
      `INSERT INTO syst_users 
        (fullname, username, email, password, blokir, id_status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.fullname,
        data.username,
        data.email,
        data.password,
        data.blokir,
        data.id_status,
      ]
    );

    return result.insertId;
  },

  // ===============================
  // INSERT ROLE KE USER
  // ===============================
  insertUserRole(userId, roleId) {
    return db.query(
      `INSERT INTO syst_users_roles (users_id, roles_id) VALUES (?, ?)`,
      [userId, roleId]
    );
  },

  // ===============================
  // HAPUS SEMUA ROLE USER
  // ===============================
  clearUserRoles(userId) {
    return db.query(
      `DELETE FROM syst_users_roles WHERE users_id = ?`,
      [userId]
    );
  },

  // ===============================
  // UPDATE USER
  // ===============================
  update(id, data) {
    const fields = [];
    const values = [];

    for (const key in data) {
      fields.push(`${key}=?`);
      values.push(data[key]);
    }

    values.push(id);

    const sql = `UPDATE syst_users SET ${fields.join(", ")} WHERE id=?`;
    return db.query(sql, values);
  },

  // ===============================
  // DELETE USER
  // ===============================
  delete(id) {
    return db.query(`DELETE FROM syst_users WHERE id = ?`, [id]);
  },

  // ===============================
  // AMBIL SEMUA ROLE USER
  // ===============================
  getUserRoles(userId) {
    return db.query(
      `SELECT roles_id FROM syst_users_roles WHERE users_id = ?`,
      [userId]
    );
  },

  // ===============================
  // INSERT ROLE DENGAN STATUS
  // ===============================
  insertUserRoleWithStatus(userId, roleId, status) {
    return db.query(
      `INSERT INTO syst_users_roles (users_id, roles_id, id_status)
      VALUES (?, ?, ?)`,
      [userId, roleId, status]
    );
  },

  // ===============================
  // UPDATE STATUS ROLE
  // ===============================
  updateUserRoleStatus(userId, roleId, status) {
    return db.query(
      `UPDATE syst_users_roles 
      SET id_status = ? 
      WHERE users_id = ? AND roles_id = ?`,
      [status, userId, roleId]
    );
  },

  // ===============================
  // CEK DUPLIKASI
  // ===============================
  checkDuplicate(username, email) {
    return db.query(
      `SELECT id, username, email 
       FROM syst_users 
       WHERE (username = ? OR email = ?)`,
      [username, email]
    );
  },

  checkDuplicateOnUpdate(id, username, email) {
    return db.query(
      `SELECT id, username, email 
       FROM syst_users 
       WHERE (username = ? OR email = ?) 
         AND id != ?`,
      [username, email, id]
    );
  },

};
