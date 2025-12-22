// models/public/tabunganModel.js
const db = require("../../config/db");

module.exports = {
  // =========================
  // GET ALL
  // =========================
  getAll() {
    return db.query(`
      SELECT 
        ns.id,
        ns.id_nasabah,
        DATE_FORMAT(ns.tanggal_simpan, '%Y-%m-%d') AS tanggal_simpan,
        ns.jenis_simpanan,
        ns.jumlah_simpanan,
        ns.keterangan,
        ns.id_users,
        na.nm_nasabah
      FROM dt_tabungan ns
      INNER JOIN dt_nasabah na ON na.id = ns.id_nasabah
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
          ns.id_nasabah,
          DATE_FORMAT(ns.tanggal_simpan, '%Y-%m-%d') AS tanggal_simpan,
          ns.jenis_simpanan,
          ns.jumlah_simpanan,
          ns.keterangan,
          ns.id_users,
          na.nm_nasabah
        FROM dt_tabungan ns
        INNER JOIN dt_nasabah na ON na.id = ns.id_nasabah
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
      INSERT INTO dt_tabungan (
        id_nasabah,
        tanggal_simpan,
        jenis_simpanan,
        jumlah_simpanan,
        keterangan,
        id_users
      ) VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        data.id_nasabah,
        data.tanggal_simpan,
        data.jenis_simpanan,
        data.jumlah_simpanan,
        data.keterangan,
        data.id_users,
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
        tanggal_simpan,
        jenis_simpanan,
        jumlah_simpanan,
        keterangan,
        id_users
      FROM dt_tabungan
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
      UPDATE dt_tabungan
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    return db.query(sql, values);
  },

  // =========================
  // DELETE
  // =========================
  delete(id) {
    return db.query("DELETE FROM dt_tabungan WHERE id = ?", [id]);
  },

};
