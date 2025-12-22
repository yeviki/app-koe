// models/public/nasabahModel.js
const db = require("../../config/db");

module.exports = {
  // =========================
  // GET ALL (ADMIN)
  // =========================
  getAll() {
    return db.query(`
      SELECT 
        ns.id,
        ns.nm_nasabah,
        ns.no_hp,
        ns.alamat,
        ns.id_status,
        ns.foto_ktp,
        ns.foto_nasabah,
        ns.foto_rumah,
        ns.foto_usaha,
        ns.foto_promise,
        ns.id_users
      FROM dt_nasabah ns
      ORDER BY ns.id ASC
    `);
  },

  // =========================
  // GET BY USER LOGIN
  // =========================
  getByUser(userId) {
    return db.query(
      `
      SELECT 
        ns.id,
        ns.nm_nasabah,
        ns.no_hp,
        ns.alamat,
        ns.id_status,
        ns.foto_ktp,
        ns.foto_nasabah,
        ns.foto_rumah,
        ns.foto_usaha,
        ns.foto_promise,
        ns.id_users
      FROM dt_nasabah ns
      WHERE ns.id_users = ?
      ORDER BY ns.id ASC
      `,
      [userId]
    );
  },

  // =========================
  // CREATE
  // =========================
  create(data) {
    return db.query(
      `
      INSERT INTO dt_nasabah (
        nm_nasabah,
        no_hp,
        alamat,
        id_status,
        foto_ktp,
        foto_nasabah,
        foto_rumah,
        foto_usaha,
        foto_promise,
        id_users
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.nm_nasabah,
        data.no_hp,
        data.alamat,
        data.id_status,
        data.foto_ktp,
        data.foto_nasabah,
        data.foto_rumah,
        data.foto_usaha,
        data.foto_promise,
        data.id_users
      ]
    );
  },

  // =========================
  // GET BY ID
  // =========================
  getById(id) {
    return db.query(
      `
      SELECT 
        id,
        nm_nasabah,
        no_hp,
        alamat,
        id_status,
        foto_ktp,
        foto_nasabah,
        foto_rumah,
        foto_usaha,
        foto_promise,
        id_users
      FROM dt_nasabah
      WHERE id = ?
      `,
      [id]
    );
  },

  // =========================
  // UPDATE (DINAMIS)
  // =========================
  update(id, data) {
    const fields = [];
    const values = [];

    for (const key in data) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }

    values.push(id);

    const sql = `
      UPDATE dt_nasabah
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    return db.query(sql, values);
  },

  // =========================
  // DELETE
  // =========================
  delete(id) {
    return db.query("DELETE FROM dt_nasabah WHERE id = ?", [id]);
  },

  // =========================
  // DUPLICATE CHECK
  // =========================
  checkDuplicate(no_hp) {
    return db.query(
      "SELECT id FROM dt_nasabah WHERE no_hp = ?",
      [no_hp]
    );
  },

  checkDuplicateOnUpdate(id, no_hp) {
    return db.query(
      "SELECT id FROM dt_nasabah WHERE no_hp = ? AND id != ?",
      [no_hp, id]
    );
  },

  // =========================
  // CHECK TRANSAKSI
  // =========================
  checkTransaksi(id) {
  return db.query(
      "SELECT id_nasabah FROM dt_regis_nasabah WHERE id_nasabah = ? LIMIT 1",
      [id]
    );
  }

};
