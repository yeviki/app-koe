const db = require("../../config/db");

module.exports = {
  create(data) {
    return db.query(
      `INSERT INTO dt_angsuran 
       (id_pinjaman, angsuran_ke, tgl_transaksi, jumlah_setor, id_users, created_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.id_pinjaman,
        data.angsuran_ke,
        data.tgl_transaksi,
        data.jumlah_setor,
        data.id_users,
        data.created_date
      ]
    );
  },

  getByPinjaman(id) {
    return db.query(
      `SELECT 
        pj.id,
        pj.id_pinjaman,
        DATE_FORMAT(pj.tgl_transaksi, '%Y-%m-%d') AS tgl_transaksi,
        pj.jumlah_setor,
        pj.angsuran_ke,
        pj.created_date,
        pj.keterangan,
        pj.id_users,
        na.nomor_regis,
        us.nm_nasabah
      FROM dt_angsuran pj
      INNER JOIN dt_pinjaman na ON na.id = pj.id_pinjaman
      INNER JOIN dt_nasabah us ON us.id = na.id_nasabah 
      WHERE pj.id_pinjaman = ?
      ORDER BY pj.angsuran_ke ASC`,
      [id]
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
        pj.id_pinjaman,
        DATE_FORMAT(pj.tgl_transaksi, '%Y-%m-%d') AS tgl_transaksi,
        pj.jumlah_setor,
        pj.angsuran_ke,
        pj.created_date,
        pj.keterangan,
        pj.id_users,
        na.nomor_regis,
        us.nm_nasabah
      FROM dt_angsuran pj
      INNER JOIN dt_pinjaman na ON na.id = pj.id_pinjaman
      INNER JOIN dt_nasabah us ON us.id = na.id_nasabah
      WHERE pj.id = ?
      `,
      [id]
    );
  },

  // =========================
  // DELETE
  // =========================
  delete(id) {
    return db.query("DELETE FROM dt_angsuran WHERE id = ?", [id]);
  },

  // =========================
  // CEK DUPLIKASI ANGSURAN
  // =========================
  checkDuplicate(id_pinjaman, angsuran_ke, tgl_transaksi) {
    return db.query(
      `
      SELECT id 
      FROM dt_angsuran
      WHERE id_pinjaman = ?
        AND (
          angsuran_ke = ?
          OR tgl_transaksi = ?
        )
      LIMIT 1
      `,
      [id_pinjaman, angsuran_ke, tgl_transaksi]
    );
  },

  // =========================
  // CEK ANGSURAN KE
  // =========================
  checkAngsuranKe(id_pinjaman, angsuran_ke) {
    return db.query(
      `
      SELECT id 
      FROM dt_angsuran
      WHERE id_pinjaman = ?
        AND angsuran_ke = ?
      LIMIT 1
      `,
      [id_pinjaman, angsuran_ke]
    );
  },

  // =========================
  // CEK TANGGAL ANGSURAN
  // =========================
  checkTanggal(id_pinjaman, tgl_transaksi) {
    return db.query(
      `
      SELECT id 
      FROM dt_angsuran
      WHERE id_pinjaman = ?
        AND tgl_transaksi = ?
      LIMIT 1
      `,
      [id_pinjaman, tgl_transaksi]
    );
  },

  // =========================
  // AMBIL TENOR PINJAMAN
  // =========================
  getTenorPinjaman(id_pinjaman) {
    return db.query(
      `
      SELECT tenor_hari
      FROM dt_pinjaman
      WHERE id = ?
      LIMIT 1
      `,
      [id_pinjaman]
    );
  },

  // =========================
  // AMBIL NOMINAL ANGSURAN
  // =========================
  getNominalAngsuran(id_pinjaman) {
    return db.query(
      `
      SELECT total_angsuran
      FROM dt_pinjaman
      WHERE id = ?
      LIMIT 1
      `,
      [id_pinjaman]
    );
  },

  // =========================
  // HITUNG TOTAL SETOR
  // =========================
  getTotalSetor(id_pinjaman) {
    return db.query(
      `
      SELECT IFNULL(SUM(jumlah_setor), 0) AS total_setor
      FROM dt_angsuran
      WHERE id_pinjaman = ?
      `,
      [id_pinjaman]
    );
  },

  getDetailPinjaman(id) {
    return db.query(
      `
      SELECT total_keseluruhan, total_angsuran, tenor_hari
      FROM dt_pinjaman
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );
  },

  // =========================
  // LAPORAN ANGSURAN
  // =========================
  getAngsuranHarian(tanggal, userId = null) {
    let sql = `
      SELECT 
        pj.nomor_regis,
        na.nm_nasabah,
        ag.angsuran_ke,
        DATE_FORMAT(ag.tgl_transaksi, '%Y-%m-%d') AS tgl_transaksi,
        ag.jumlah_setor
      FROM dt_angsuran ag
      INNER JOIN dt_pinjaman pj ON pj.id = ag.id_pinjaman
      INNER JOIN dt_nasabah na ON na.id = pj.id_nasabah
      WHERE DATE(ag.tgl_transaksi) = ?
    `;

    const params = [tanggal];

    if (userId) {
      sql += " AND ag.id_users = ?";
      params.push(userId);
    }

    sql += " ORDER BY ag.tgl_transaksi ASC";

    return db.query(sql, params);
  },

  getAngsuranRange(start, end, userId = null) {
    let sql = `
      SELECT 
        pj.nomor_regis,
        na.nm_nasabah,
        ag.angsuran_ke,
        DATE_FORMAT(ag.tgl_transaksi, '%Y-%m-%d') AS tgl_transaksi,
        ag.jumlah_setor
      FROM dt_angsuran ag
      INNER JOIN dt_pinjaman pj ON pj.id = ag.id_pinjaman
      INNER JOIN dt_nasabah na ON na.id = pj.id_nasabah
      WHERE DATE(ag.tgl_transaksi) BETWEEN ? AND ?
    `;

    const params = [start, end];

    if (userId) {
      sql += " AND ag.id_users = ?";
      params.push(userId);
    }

    sql += " ORDER BY ag.tgl_transaksi ASC";

    return db.query(sql, params);
  },

  getAngsuranBulanan(bulan, userId = null) {
    // format bulan: YYYY-MM
    let sql = `
      SELECT 
        pj.nomor_regis,
        na.nm_nasabah,
        ag.angsuran_ke,
        DATE_FORMAT(ag.tgl_transaksi, '%Y-%m-%d') AS tgl_transaksi,
        ag.jumlah_setor
      FROM dt_angsuran ag
      INNER JOIN dt_pinjaman pj ON pj.id = ag.id_pinjaman
      INNER JOIN dt_nasabah na ON na.id = pj.id_nasabah
      WHERE DATE_FORMAT(ag.tgl_transaksi, '%Y-%m') = ?
    `;

    const params = [bulan];

    if (userId) {
      sql += " AND ag.id_users = ?";
      params.push(userId);
    }

    sql += " ORDER BY ag.tgl_transaksi ASC";

    return db.query(sql, params);
  },

  getAngsuranTahunan(tahun, userId = null) {
    let sql = `
      SELECT 
        pj.nomor_regis,
        na.nm_nasabah,
        ag.angsuran_ke,
        DATE_FORMAT(ag.tgl_transaksi, '%Y-%m-%d') AS tgl_transaksi,
        ag.jumlah_setor
      FROM dt_angsuran ag
      INNER JOIN dt_pinjaman pj ON pj.id = ag.id_pinjaman
      INNER JOIN dt_nasabah na ON na.id = pj.id_nasabah
      WHERE YEAR(ag.tgl_transaksi) = ?
    `;

    const params = [tahun];

    if (userId) {
      sql += " AND ag.id_users = ?";
      params.push(userId);
    }

    sql += " ORDER BY ag.tgl_transaksi ASC";

    return db.query(sql, params);
  },

};
