const ModelData = require("../../models/public/dashboardModel");
const { sanitize } = require("../../utils/validate");

// ===============================
// LIST NASABAH JATUH TEMPO HARI INI
// ===============================
exports.nasabahJatuhTempoHariIni = async (req, res, next) => {
  try {
    const roleId = req.user.roles_id;
    const userId = req.user.id;
    const isAdmin = [1, 2].includes(Number(roleId));

    const tanggal = new Date().toISOString().slice(0, 10);

    const [rows] = await ModelData.getNasabahJatuhTempoHarianDenganStatus(
      tanggal,
      isAdmin ? null : userId
    );

    res.json({
      tanggal,
      total: rows.length,
      data: rows.map(r => ({
        ...r,
        status_bayar: r.id_angsuran ? "Sudah Bayar" : "Belum Bayar"
      }))
    });
  } catch (err) {
    next(err);
  }
};

// ===============================
// TOTAL SETOR HARI INI (CARD)
// ===============================
exports.totalSetorHariIni = async (req, res, next) => {
  try {
    const roleId = req.user.roles_id;
    const userId = req.user.id;
    const isAdmin = [1, 2].includes(Number(roleId));

    const tanggal = new Date().toISOString().slice(0, 10);

    const [[row]] = await ModelData.getTotalSetorHarian(
      tanggal,
      isAdmin ? null : userId
    );

    res.json({
      tanggal,
      total_setor: Number(row.total_setor || 0),
    });
  } catch (err) {
    next(err);
  }
};

// ===============================
// TOTAL KEUNTUNGAN BULANAN (CARD)
// ===============================
exports.totalKeuntunganBulanan = async (req, res, next) => {
  try {
    let { tahun, bulan } = req.query;

    tahun = tahun || new Date().getFullYear();
    bulan = bulan || new Date().getMonth() + 1;

    const roleId = req.user.roles_id;
    const userId = req.user.id;
    const isAdmin = [1, 2].includes(Number(roleId));

    const [[row]] = await ModelData.getTotalKeuntunganBulanan(
      tahun,
      bulan,
      isAdmin ? null : userId
    );

    res.json({
      tahun,
      bulan,
      total_keuntungan: Number(row?.total_keuntungan || 0),
    });
  } catch (err) {
    next(err);
  }
};

// ===============================
// GRAFIK SETORAN (RANGE / BULAN)
// ===============================
exports.grafikSetoran = async (req, res, next) => {
  try {
    const { mode, start, end, bulan, startBulan, endBulan } = req.query;

    const roleId = req.user.roles_id;
    const userId = req.user.id;
    const isAdmin = [1, 2].includes(Number(roleId));

    let rows;
    
    if (mode === "range") {
      if (!start || !end) throw new Error("Range tanggal wajib diisi");
      [rows] = await ModelData.getGrafikSetoranRange(
        start,
        end,
        isAdmin ? null : userId
      );
    } else if (mode === "range_bulan") {
      if (!startBulan || !endBulan)
        throw new Error("Range bulan wajib diisi");

      [rows] = await ModelData.getGrafikSetoranRangeBulan(
        startBulan,
        endBulan,
        isAdmin ? null : userId
      );
    } else if (mode === "bulan") {
      if (!bulan) throw new Error("Bulan wajib diisi");
      [rows] = await ModelData.getGrafikSetoranBulanan(
        bulan,
        isAdmin ? null : userId
      );

    } else {
      throw new Error("Mode tidak valid");
    }

    res.json({
      labels: rows.map(r => r.label),
      data: rows.map(r => Number(r.total))
    });
  } catch (err) {
    next(err);
  }
};

// ===============================
// GRAFIK KEUNTUNGAN BULANAN (TAHUN)
// ===============================
exports.grafikKeuntunganBulanan = async (req, res, next) => {
  try {
    const { tahun, bulan } = req.query;

    const roleId = req.user.roles_id;
    const userId = req.user.id;
    const isAdmin = [1, 2].includes(Number(roleId));

    const [rows] = await ModelData.getGrafikKeuntunganTahunan(
      tahun,
      bulan || null,
      isAdmin ? null : userId
    );

    res.json({
      labels: rows.map(r => r.label),
      data: rows.map(r => Number(r.total)),
    });
  } catch (err) {
    next(err);
  }
};

// ===============================
// GRAFIK KEUANGAN DINAMIS
// ===============================
exports.grafikKeuangan = async (req, res, next) => {
  try {
    const { mode, tanggal, start, end, bulan, tahun } = req.query;

    const roleId = req.user.roles_id;
    const userId = req.user.id;
    const isAdmin = [1, 2].includes(Number(roleId));

    let row;

    switch (mode) {
      case "harian":
        [[row]] = await ModelData.getKeuanganHarian(
          tanggal,
          isAdmin ? null : userId
        );
        break;

      case "range_tanggal":
        [[row]] = await ModelData.getKeuanganRangeTanggal(
          start,
          end,
          isAdmin ? null : userId
        );
        break;

      case "bulan":
        [[row]] = await ModelData.getKeuanganBulanan(
            bulan,
            tahun,
            isAdmin ? null : userId
        );
        break;

      case "tahun":
        [[row]] = await ModelData.getKeuanganTahunan(
          tahun,
          isAdmin ? null : userId
        );
        break;

      default:
        throw new Error("Mode tidak valid");
    }

    res.json({
      labels: ["Administrasi", "Bunga", "Uang Keluar", "Total Keseluruhan"],
      data: {
        admin: Number(row.total_adm || 0),
        bunga: Number(row.total_bunga || 0),
        diterima: Number(row.total_diterima || 0),
        keseluruhan: Number(row.total_keseluruhan || 0),
      },
    });
  } catch (err) {
    next(err);
  }
};
