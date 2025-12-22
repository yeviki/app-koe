const db = require("../../config/db");

module.exports = {

    // ===============================
    // NASABAH JATUH TEMPO HARIAN
    // ===============================
    getNasabahJatuhTempoHarianDenganStatus(tanggal, userId = null) {
        let sql = `
            SELECT
            pj.id,
            pj.nomor_regis,
            ns.nm_nasabah,
            ns.no_hp,
            pj.total_angsuran,
            pj.total_keseluruhan,
            pj.tgl_pinjaman,
            DATE_ADD(pj.tgl_pinjaman, INTERVAL 1 DAY) AS tgl_angsuran_pertama,
            DATE_ADD(pj.tgl_pinjaman, INTERVAL pj.tenor_hari DAY) AS tgl_angsuran_terakhir,
            COALESCE(ag.id, NULL) AS id_angsuran,
            COALESCE(ag.jumlah_setor, 0) AS jumlah_setor,
            COALESCE(ag.tgl_transaksi, NULL) AS tgl_bayar
            FROM dt_pinjaman pj
            INNER JOIN dt_nasabah ns ON ns.id = pj.id_nasabah
            LEFT JOIN dt_angsuran ag 
            ON ag.id_pinjaman = pj.id
            AND ag.angsuran_ke = DATEDIFF(?, DATE_ADD(pj.tgl_pinjaman, INTERVAL 1 DAY)) + 1
            AND DATE(ag.tgl_transaksi) = ?
            WHERE ? BETWEEN DATE_ADD(pj.tgl_pinjaman, INTERVAL 1 DAY)
                        AND DATE_ADD(pj.tgl_pinjaman, INTERVAL pj.tenor_hari DAY)
        `;

        const params = [tanggal, tanggal, tanggal];

        if (userId) {
            sql += " AND pj.id_users = ?";
            params.push(userId);
        }

        sql += " ORDER BY ns.nm_nasabah ASC";

        return db.query(sql, params);
    },


  // ===============================
  // CARD
  // ===============================
  getTotalSetorHarian(tanggal, userId = null) {
    let sql = `
      SELECT IFNULL(SUM(jumlah_setor),0) AS total_setor
      FROM dt_angsuran
      WHERE DATE(tgl_transaksi) = ?
    `;
    const params = [tanggal];

    if (userId) {
      sql += " AND id_users = ?";
      params.push(userId);
    }

    return db.query(sql, params);
  },

  getTotalKeuntunganBulanan(tahun, bulan, userId = null) {
    let sql = `
      SELECT 
        IFNULL(SUM(adm + tot_bunga),0) AS total_keuntungan
      FROM dt_pinjaman
      WHERE YEAR(tgl_pinjaman) = ?
        AND MONTH(tgl_pinjaman) = ?
    `;
    const params = [tahun, bulan];

    if (userId) {
      sql += " AND id_users = ?";
      params.push(userId);
    }

    return db.query(sql, params);
  },

  // ===============================
  // GRAFIK SETORAN
  // ===============================
  getGrafikSetoranRangeBulan(startBulan, endBulan, userId = null) {
    let sql = `
      SELECT
        DATE_FORMAT(tgl_transaksi, '%Y-%m') AS label,
        SUM(jumlah_setor) AS total
      FROM dt_angsuran
      WHERE DATE_FORMAT(tgl_transaksi, '%Y-%m')
            BETWEEN ? AND ?
    `;

    const params = [startBulan, endBulan];

    if (userId) {
      sql += " AND id_users = ?";
      params.push(userId);
    }

    sql += `
      GROUP BY DATE_FORMAT(tgl_transaksi, '%Y-%m')
      ORDER BY label ASC
    `;

    return db.query(sql, params);
  },

  getGrafikSetoranRange(start, end, userId = null) {
    let sql = `
      SELECT 
        DATE_FORMAT(tgl_transaksi, '%Y-%m-%d') AS label,
        SUM(jumlah_setor) AS total
      FROM dt_angsuran
      WHERE DATE(tgl_transaksi) BETWEEN ? AND ?
    `;
    const params = [start, end];

    if (userId) {
      sql += " AND id_users = ?";
      params.push(userId);
    }

    sql += " GROUP BY label ORDER BY label ASC";
    return db.query(sql, params);
  },

  getGrafikSetoranBulanan(bulan, userId = null) {
    let sql = `
      SELECT 
        DATE_FORMAT(tgl_transaksi, '%Y-%m-%d') AS label,
        SUM(jumlah_setor) AS total
      FROM dt_angsuran
      WHERE DATE_FORMAT(tgl_transaksi, '%Y-%m') = ?
    `;
    const params = [bulan];

    if (userId) {
      sql += " AND id_users = ?";
      params.push(userId);
    }

    sql += " GROUP BY label ORDER BY label ASC";
    return db.query(sql, params);
  },

  // ===============================
  // GRAFIK KEUNTUNGAN BULANAN
  // ===============================
  getGrafikKeuntunganTahunan(tahun, bulan = null, userId = null) {
    let sql = `
        SELECT
        MONTH(tgl_pinjaman) AS bulan,
        DATE_FORMAT(tgl_pinjaman, '%b') AS label,
        SUM(adm + tot_bunga) AS total
        FROM dt_pinjaman
        WHERE YEAR(tgl_pinjaman) = ?
    `;
    const params = [tahun];

    if (bulan) {
        sql += " AND MONTH(tgl_pinjaman) = ?";
        params.push(bulan);
    }

    if (userId) {
        sql += " AND id_users = ?";
        params.push(userId);
    }

    sql += `
        GROUP BY
        MONTH(tgl_pinjaman),
        DATE_FORMAT(tgl_pinjaman, '%b')
        ORDER BY
        MONTH(tgl_pinjaman)
    `;

    return db.query(sql, params);
    },


  // ===============================
  // GRAFIK KEUANGAN DINAMIS
  // ===============================
  getKeuanganHarian(tanggal, userId = null) {
    return this._getKeuangan(
      "DATE(tgl_pinjaman) = ?",
      [tanggal],
      userId
    );
  },

  getKeuanganRangeTanggal(start, end, userId = null) {
    return this._getKeuangan(
      "DATE(tgl_pinjaman) BETWEEN ? AND ?",
      [start, end],
      userId
    );
  },

  getKeuanganBulanan(bulan, tahun, userId = null) {
    return this._getKeuangan(
        "YEAR(tgl_pinjaman) = ? AND MONTH(tgl_pinjaman) = ?",
        [tahun, bulan],
        userId
    );
  },

  getKeuanganTahunan(tahun, userId = null) {
    return this._getKeuangan(
      "YEAR(tgl_pinjaman) = ?",
      [tahun],
      userId
    );
  },

  _getKeuangan(where, params, userId) {
    let sql = `
      SELECT
        IFNULL(SUM(adm),0) AS total_adm,
        IFNULL(SUM(tot_bunga),0) AS total_bunga,
        IFNULL(SUM(total_diterima),0) AS total_diterima,
        IFNULL(SUM(total_keseluruhan),0) AS total_keseluruhan
      FROM dt_pinjaman
      WHERE ${where}
    `;

    if (userId) {
      sql += " AND id_users = ?";
      params.push(userId);
    }

    return db.query(sql, params);
  }
};
