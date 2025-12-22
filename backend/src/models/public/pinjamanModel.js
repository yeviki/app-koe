// models/public/pinjamanModel.js
const db = require("../../config/db");

module.exports = {
  // =========================
  // GET ALL
  // =========================
  getAll() {
    return db.query(`
      SELECT 
        pj.id,
        pj.id_nasabah,
        pj.nomor_regis,
        DATE_FORMAT(pj.tgl_pinjaman, '%Y-%m-%d') AS tgl_pinjaman,
        pj.jml_pinjaman,
        pj.bunga,
        pj.adm,
        pj.tot_bunga,
        pj.tenor_hari,
        pj.total_angsuran,
        pj.total_diterima,
        pj.status_transaksi,
        pj.id_users,
        pj.created_date,
        pj.total_keseluruhan,
        pj.keterangan,
        na.nm_nasabah,

        -- 🔥 TAMBAHAN
        IFNULL(SUM(ag.jumlah_setor), 0) AS total_setor,
        IF(IFNULL(SUM(ag.jumlah_setor),0) >= pj.total_keseluruhan, 1, 0) AS is_lunas

      FROM dt_pinjaman pj
      INNER JOIN dt_nasabah na ON na.id = pj.id_nasabah
      INNER JOIN syst_users us ON us.id = pj.id_users
      LEFT JOIN dt_angsuran ag ON ag.id_pinjaman = pj.id
      GROUP BY pj.id
      ORDER BY pj.id ASC
    `);
  },

  // =========================
  // GET BY USER LOGIN
  // =========================
  getByUser(userId) {
    return db.query(
      `
      SELECT 
        pj.id,
        pj.id_nasabah,
        pj.nomor_regis,
        DATE_FORMAT(pj.tgl_pinjaman, '%Y-%m-%d') AS tgl_pinjaman,
        pj.jml_pinjaman,
        pj.bunga,
        pj.adm,
        pj.tot_bunga,
        pj.tenor_hari,
        pj.total_angsuran,
        pj.total_diterima,
        pj.status_transaksi,
        pj.id_users,
        pj.created_date,
        pj.total_keseluruhan,
        pj.keterangan,
        na.nm_nasabah,

        -- 🔥 TAMBAHAN
        IFNULL(SUM(ag.jumlah_setor), 0) AS total_setor,
        IF(IFNULL(SUM(ag.jumlah_setor),0) >= pj.total_keseluruhan, 1, 0) AS is_lunas

      FROM dt_pinjaman pj
      INNER JOIN dt_nasabah na ON na.id = pj.id_nasabah
      INNER JOIN syst_users us ON us.id = pj.id_users
      LEFT JOIN dt_angsuran ag ON ag.id_pinjaman = pj.id
      WHERE pj.id_users = ?
      GROUP BY pj.id
      ORDER BY pj.id ASC
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
      INSERT INTO dt_pinjaman (
        id_nasabah,
        nomor_regis,
        tgl_pinjaman,
        jml_pinjaman,
        bunga,
        adm,
        tot_bunga,
        tenor_hari,
        total_angsuran,
        total_diterima,
        status_transaksi,
        id_users,
        created_date,
        total_keseluruhan,
        keterangan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.id_nasabah,
        data.nomor_regis,
        data.tgl_pinjaman,
        data.jml_pinjaman,
        data.bunga,
        data.adm,
        data.tot_bunga,
        data.tenor_hari,
        data.total_angsuran,
        data.total_diterima,
        data.status_transaksi,
        data.id_users,         
        data.created_date,
        data.total_keseluruhan,
        data.keterangan,
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
        pj.id,
        pj.id_nasabah,
        pj.nomor_regis,
        pj.jml_pinjaman,
        pj.bunga,
        pj.adm,
        pj.tot_bunga,
        pj.tenor_hari,
        pj.total_angsuran,
        pj.total_diterima,
        pj.status_transaksi,
        pj.id_users,
        pj.created_date,
        pj.total_keseluruhan,
        pj.keterangan,
        na.nm_nasabah,

        IFNULL(SUM(ag.jumlah_setor), 0) AS total_setor,
        IF(IFNULL(SUM(ag.jumlah_setor),0) >= pj.total_keseluruhan, 1, 0) AS is_lunas

      FROM dt_pinjaman pj
      INNER JOIN dt_nasabah na ON na.id = pj.id_nasabah
      INNER JOIN syst_users us ON us.id = pj.id_users
      LEFT JOIN dt_angsuran ag ON ag.id_pinjaman = pj.id
      WHERE pj.id = ?
      GROUP BY pj.id
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
      UPDATE dt_pinjaman
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    return db.query(sql, values);
  },

  // =========================
  // DELETE
  // =========================
  delete(id) {
    return db.query("DELETE FROM dt_pinjaman WHERE id = ?", [id]);
  },
};
